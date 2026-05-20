import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

import { ConfigService } from '@nestjs/config';
import { enableCors } from './common/enable-cors';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { CustomValidationPipe } from './common/pipes/custom-validation.pipe';
import { EnvVars } from './config/config.validation';
import { initSwagger } from './config/swagger.config';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.setGlobalPrefix('api');
  enableCors(app);

  app.use(cookieParser());

  // 1. use global pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new CustomValidationPipe());

  initSwagger(app);
  const configService = app.get(ConfigService<EnvVars>);
  const port = configService.get<number>('PORT');
  await app.listen(port!, '0.0.0.0');
}
void bootstrap();
