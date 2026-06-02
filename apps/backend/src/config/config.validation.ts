import * as Joi from 'joi';

export const envValidationSchema = Joi.object<EnvVars>({
  PORT: Joi.number().default(3000),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['postgresql', 'postgres'] })
    .required(),
  POSTGRES_USER: Joi.string().required(),
  POSTGRES_PASSWORD: Joi.string().required(),
  POSTGRES_DB: Joi.string().required(),
  ACCESS_TOKEN_SECRET: Joi.string().required(),
  ACCESS_TOKEN_EXPIRES_IN: Joi.number().required(),
  REFRESH_TOKEN_SECRET: Joi.string().required(),
  REFRESH_TOKEN_EXPIRES_IN: Joi.number().required(),
  RESET_PASSWORD_TOKEN_SECRET: Joi.string().required(),
  RESET_PASSWORD_TOKEN_EXPIRES_IN: Joi.number().required(),
  FE_URL: Joi.string().uri().required(),
  GOOGLE_SMTP_USER: Joi.string().required(),
  GOOGLE_SMTP_PASS: Joi.string().required(),
  COOKIE_DOMAIN: Joi.string().allow('').optional(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
  MEILISEARCH_HOST: Joi.string().uri(),
  MEILI_MASTER_KEY: Joi.string(),
});

export interface EnvVars {
  PORT: string;
  DATABASE_URL: string;
  POSTGRES_USER: string;
  POSTGRES_PASSWORD: string;
  POSTGRES_DB: string;
  ACCESS_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: number;
  REFRESH_TOKEN_SECRET: string;
  REFRESH_TOKEN_EXPIRES_IN: number;
  RESET_PASSWORD_TOKEN_SECRET: string;
  RESET_PASSWORD_TOKEN_EXPIRES_IN: number;
  FE_URL: string;
  GOOGLE_SMTP_USER: string;
  GOOGLE_SMTP_PASS: string;
  COOKIE_DOMAIN?: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD?: string;
  MEILISEARCH_HOST: string;
  MEILI_MASTER_KEY: string;
}
