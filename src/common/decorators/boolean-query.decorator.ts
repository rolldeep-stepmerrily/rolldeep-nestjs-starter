import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const BooleanQuery = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();

  const value = request.query[data];

  if (value === 'true' || value === '1') {
    return true;
  }

  if (value === 'false' || value === '0') {
    return false;
  }

  return undefined;
});
