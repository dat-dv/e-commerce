import { TAccessTokenPayload } from 'src/api/auth/auth.types';

export type TAppRequest = Omit<Request, 'cookies'> & {
  user: TAccessTokenPayload;
  cookies: {
    access_token: string;
    refresh_token: string;
  };
};
