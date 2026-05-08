import * as Joi from 'joi';

export const envValidationSchema = Joi.object<AppConfig>({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.string().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.string().required(),
});

export interface AppConfig {
  PORT: string;
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: string;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: string;
}
