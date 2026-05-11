import * as Joi from 'joi';

export const envValidationSchema = Joi.object<EnvVars>({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
  RESET_PASSWORD_TOKEN_SECRET: Joi.string().required(),
  RESET_PASSWORD_TOKEN_EXPIRES_IN: Joi.number().required(),
  FE_URL: Joi.string().uri().required(),
  GOOGLE_SMTP_USER: Joi.string().required(),
  GOOGLE_SMTP_PASS: Joi.string().required(),
});

export interface EnvVars {
  PORT: string;
  DATABASE_URL: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: number;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: number;
  RESET_PASSWORD_TOKEN_SECRET: string;
  RESET_PASSWORD_TOKEN_EXPIRES_IN: number;
  FE_URL: string;
  GOOGLE_SMTP_USER: string;
  GOOGLE_SMTP_PASS: string;
}
