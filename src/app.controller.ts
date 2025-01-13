import { readFile } from 'fs/promises';
import { join } from 'path';

import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController } from '@nestjs/swagger';

import { CustomHttpException, GLOBAL_ERRORS } from '@@exceptions';

@ApiExcludeController()
@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  @Get('changelog')
  async changelog(): Promise<string> {
    if (this.configService.getOrThrow('NODE_ENV') !== 'development') {
      throw new CustomHttpException(GLOBAL_ERRORS.CHANGELOG_NOT_FOUND);
    }

    const filePath = join(__dirname, '..', 'swagger', 'swagger-changelog.md');
    const content = await readFile(filePath, { encoding: 'utf-8' });

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>version-log</title>
          <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              line-height: 1.6; 
              padding: 20px; 
              background-color: #1a1a1a; 
              color: #e0e0e0; 
            }
            h1, h2, h3 { 
              color: #f0f0f0; 
            }
            a {
              color: #4CAF50;
            }
            code {
              background-color: #2b2b2b;
              padding: 2px 4px;
              border-radius: 4px;
            }
            pre {
              background-color: #2b2b2b;
              padding: 10px;
              border-radius: 4px;
              overflow-x: auto;
            }
          </style>
        </head>
        <body>
      
          <div id="content"></div>
          <script>
            document.getElementById('content').innerHTML = marked.parse(${JSON.stringify(content)}); 
          </script>
        </body>
      </html>
    `;
  }
}
