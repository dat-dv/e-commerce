import { AdminAuthRepository } from "../infrastructure/auth.repository";
import { AdminFetchMeUseCase } from "./fetch-me.use-case";
import { AdminForgotPasswordUseCase } from "./forgot-password.use-case";
import { AdminLoginUseCase } from "./login.use-case";

const repo = new AdminAuthRepository();

export const adminAuthUseCase = {
  login: new AdminLoginUseCase(repo),
  forgotPassword: new AdminForgotPasswordUseCase(repo),
  fetchMe: new AdminFetchMeUseCase(repo),
};
