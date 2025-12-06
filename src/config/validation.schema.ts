import * as Joi from 'joi';

export const validationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'staging', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  APP_NAME: Joi.string().required(),
  APP_SLUG: Joi.string().optional(),

  DATABASE_URL: Joi.string().required(),

  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  GOOGLE_REDIRECT_URI: Joi.string().uri().required(),

  PAYSTACK_SECRET_KEY: Joi.string().required(),
  PAYSTACK_PUBLIC_KEY: Joi.string().required(),
});
