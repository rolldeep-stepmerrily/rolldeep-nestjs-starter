import * as fs from 'fs';
import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { apiReference } from '@scalar/nestjs-api-reference';
import * as express from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const nodeEnv = configService.getOrThrow<string>('NODE_ENV');
  const isProduction = nodeEnv === 'production';

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: isProduction,
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  const port = configService.getOrThrow<number>('PORT');
  const serverUrl = configService.getOrThrow<string>('SERVER_URL');

  if (isProduction) {
    app.use(helmet());
  } else {
    app.use(express.static(join(__dirname, '..', 'docs')));

    app.useStaticAssets(join(__dirname, '..', 'docs'), { prefix: '/docs/' });

    const docs = fs.readFileSync(join(__dirname, '..', 'docs', 'docs.md'), 'utf8');

    const config = new DocumentBuilder()
      .setDescription(docs)
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    app.use(
      '/docs',
      apiReference({
        content: document,
        metaData: { title: 'fixme' },
        theme: 'deepSpace',
      }),
    );

    const countEndPoint = Object.values(document.paths).reduce((acc, cur) => {
      return (acc += Object.keys(cur).length);
    }, 0);

    const uptime = process.uptime().toFixed(2);
    const nodeVersion = process.version;
    const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const projectVersion = JSON.parse(fs.readFileSync(join(__dirname, '..', 'package.json'), 'utf8')).version;

    const uptimeMessage = `Uptime: ${uptime}s`;
    const nodeVersionMessage = `Node.js Version: ${nodeVersion}`;
    const environmentMessage = `Environment: ${nodeEnv}`;
    const memoryUsageMessage = `Memory Usage: ${memoryUsage}MB`;
    const projectVersionMessage = `Project Version: ${projectVersion}`;
    const countEndPointMessage = `Current number of endpoints: ${countEndPoint}`;
    const serverRunningMessage = `Server is running successfully at: ${serverUrl}:${port}`;

    setTimeout(() => {
      const style = '\x1b[1m\x1b[3m\x1b[44m\x1b[30m%s\x1b[0m';
      const terminalWidth = process.stdout.columns;
      const messages = [
        uptimeMessage,
        nodeVersionMessage,
        environmentMessage,
        memoryUsageMessage,
        projectVersionMessage,
        countEndPointMessage,
        serverRunningMessage,
      ];
      const maxLength = Math.max(...messages.map((msg) => msg.length));
      const leftPadding = Math.floor((terminalWidth - maxLength) / 2);
      const separator = ' '.repeat(terminalWidth);

      console.log(
        style,
        `${separator}\n${messages.map((msg) => `${' '.repeat(leftPadding)}${msg}`).join('\n')}\n${separator}`,
      );
    }, 1000);
  }

  await app.listen(port);
}
bootstrap();
