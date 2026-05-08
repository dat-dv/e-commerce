import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      cookies: {
        access_token?: string;
        refresh_token?: string;
      };
    }
  }
}
