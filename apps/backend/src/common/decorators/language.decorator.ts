import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { DEFAULT_LANGUAGE_CODE } from '../constants/app.constant';

const SUPPORT_LANGUAGE = [DEFAULT_LANGUAGE_CODE, 'vi'];

export const Language = createParamDecorator((_data: string | undefined, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();

  const headerLang = request.headers['accept-language'];
  if (headerLang) {
    const lang = headerLang.split(',')[0].split('-')[0];
    if (SUPPORT_LANGUAGE.includes(lang)) return lang;
  }

  return DEFAULT_LANGUAGE_CODE;
});
