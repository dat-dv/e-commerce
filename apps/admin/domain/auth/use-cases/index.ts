import { AdminAuthRepository } from "../infrastructure/auth.repository";
import { AdminForgotPasswordUseCase } from "./forgot-password.use-case";
import { AdminLoginUseCase } from "./login.use-case";

const repo = new AdminAuthRepository();

export const adminAuthUseCase = {
  login: new AdminLoginUseCase(repo),
  forgotPassword: new AdminForgotPasswordUseCase(repo),
};
