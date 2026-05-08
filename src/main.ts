import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';
import { initSwagger } from './config/swagger.config';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { ResponseInterceptor } from './common/intercepters/response.interceptor';
import { EnvVars } from './config/config.validation';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    allowedHeaders: 'Content-Type, Authorization, timezone',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.use(cookieParser());

  // 1. use global pipe
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  /**
   * Hạn chế vì nó ảnh hưởng đến việc generate documents cho swagger
   * app.useGlobalInterceptors(new ResponseInterceptor());
   **/

  initSwagger(app);
  const configService = app.get(ConfigService<EnvVars>);
  const port = configService.get<number>('PORT');
  await app.listen(port!);
}
void bootstrap();
