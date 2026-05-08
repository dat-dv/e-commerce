namespace Express {
  interface Request {
    cookies: {
      access_token?: string;
      refresh_token?: string;
    };
    user: {
      sub: string;
      email: string;
    };
  }
}
