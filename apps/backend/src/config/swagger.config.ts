import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const initSwagger = (app: INestApplication) => {
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for E-Commerce')
    .setVersion('1.0')
    // .addBearerAuth()
    // .addSecurityRequirements('bearer')
    .build();

  const swaggerPath = 'api/docs';
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup(swaggerPath, app, document, {
    jsonDocumentUrl: `${swaggerPath}-json`,
    swaggerOptions: {
      withCredentials: true, // Dòng này bắt Swagger gửi kèm Cookies khi request
    },
  });
};
