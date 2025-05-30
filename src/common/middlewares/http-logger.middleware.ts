import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NextFunction, Request, Response } from 'express';

interface IRequest extends Request {
  user?: { id: number };
}

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger('HTTP');

  use(req: IRequest, res: Response, next: NextFunction) {
    const startTime = Date.now();

    if (this.configService.getOrThrow('NODE_ENV') === 'development') {
      console.log(req.body);
    }

    res.on('finish', () => {
      const userIpV4 = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
      const userIpV6 = req.ips.length ? req.ips[0] : req.ip;
      const userId = req.user?.id ? ` ${req.user?.id} ` : ' ';
      const contentLength = res.getHeader('content-length') || 0;
      const referrer = req.header('Referer') || req.header('Referrer');
      const formattedReferrer = referrer ? ` "${referrer}" ` : ' ';
      const userAgent = req.header('user-agent');
      const responseTime = Date.now() - startTime;

      const message = `[${userIpV4} | ${userIpV6}] -${userId}"${req.method} ${req.originalUrl} HTTP/${req.httpVersion}" ${res.statusCode} - ${contentLength}${formattedReferrer}"${userAgent}" \x1b[33m+${responseTime}ms`;

      if (res.statusCode >= 400) {
        this.logger.error(message);
      } else {
        this.logger.log(message);
      }
    });

    next();
  }
}
