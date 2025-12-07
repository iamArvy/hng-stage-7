import { DocumentBuilder } from '@nestjs/swagger';
import { appConfig } from './app.config';

const app = appConfig();
export const swaggerConfig = () =>
  new DocumentBuilder()
    .setTitle(app.name)
    .setDescription(app.description)
    .setVersion(app.version)
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'Enter JWT token obtained from login endpoint',
    })
    .build();

export const swaggerOptions = {
  persistAuthorization: true,
};
//
