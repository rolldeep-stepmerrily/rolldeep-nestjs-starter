import * as fs from 'fs';
import { join } from 'path';

import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import * as express from 'express';
import expressBasicAuth from 'express-basic-auth';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const isProduction = configService.getOrThrow<string>('NODE_ENV') === 'production';

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

  if (isProduction) {
    app.use(helmet());
  } else {
    app.use(express.static(join(__dirname, '..', 'swagger')));

    app.useStaticAssets(join(__dirname, '..', 'swagger'), { prefix: '/swagger/' });

    const updateInfo = fs.readFileSync(join(__dirname, '..', 'swagger', 'swagger-info.md'), 'utf8');

    const GUEST_NAME = configService.getOrThrow<string>('GUEST_NAME');
    const GUEST_PASSWORD = configService.getOrThrow<string>('GUEST_PASSWORD');

    app.use(['/docs', '/docs-json'], expressBasicAuth({ challenge: true, users: { [GUEST_NAME]: GUEST_PASSWORD } }));

    const config = new DocumentBuilder()
      .setDescription(updateInfo)
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'accessToken')
      .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'refreshToken')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        defaultModelsExpandDepth: 0,
        persistAuthorization: true,
        syntaxHighlight: { theme: 'arta' },
        tryItOutEnabled: true,
        tagsSorter: 'alpha',
      },
      customJs: '/swagger-dark.js',
      customCssUrl: '/swagger-dark.css',
    });
  }

  const PORT = configService.getOrThrow<number>('PORT');

  await app.listen(PORT);
}
bootstrap();
