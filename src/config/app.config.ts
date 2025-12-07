import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  env: process.env.NODE_ENV || 'development',
  name:
    process.env.APP_NAME || 'Google Authentication and Paystack Integration',
  slug: process.env.APP_SLUG,
  host: process.env.APP_HOST || 'localhost',
  port: parseInt(process.env.PORT!, 10) || 3000,
  url: process.env.APP_URL || 'http://localhost:3000',
  prefix: process.env.APP_PREFIX || 'api',
  version: process.env.APP_VERSION || 'v1',
  description:
    process.env.APP_DESCRIPTION ||
    'Google Authentication and Paystack Integration API',
  isDev: ['development', 'dev', 'local', undefined].includes(
    process.env.NODE_ENV,
  ),
}));

export type AppConfig = ReturnType<typeof appConfig>;
