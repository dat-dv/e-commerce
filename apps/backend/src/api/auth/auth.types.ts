export type TAccessTokenPayload = {
  sub: string;
  email: string;
};

export type TRefreshTokenPayload = {
  sub: string;
};

export type TResetPasswordPayload = {
  sub: string;
  email: string;
};
