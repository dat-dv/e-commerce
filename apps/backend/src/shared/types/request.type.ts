import { Request } from 'express';

export interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
    role: string;
    [key: string]: any;
  };
  cookies: {
    access_token: string;
    refresh_token: string;
  };
}
