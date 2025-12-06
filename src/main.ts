import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig, AppConfig, swaggerConfig, swaggerOptions } from './config';
import { LoggerService, ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: AppConfig = appConfig();

  app.enableCors();
  // app.setGlobalPrefix(`${config.prefix}/${config.version}`, {
  //   exclude: ['docs'],
  // });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerDoc = swaggerConfig();
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(app, swaggerDoc),
    {
      swaggerOptions,
    },
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  if (config.isDev) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-call
    app.use(require('morgan')('dev'));
  }
  await app.listen(process.env.PORT ?? 3000);

  const logger = app.get<LoggerService>(WINSTON_MODULE_NEST_PROVIDER);
  logger.log(
    `
      ------------
      Internal Application Started!
      Environment: ${config.env}
      API: http://localhost:${config.port}/
      API Docs: http://localhost:${config.port}/docs
      ------------
  `,
    ` ${config.name} | ${config.env}`,
  );
}
bootstrap();
