import { appRequest } from "@/constants/app-request";

import { UsersRepository } from "../../users/infrastructure/users.repository";
import { UpdateProfileUseCase } from "../../users/use-cases/update-profile.use-case";
import { AuthRepository } from "../infrastructure/auth.repository";
import { ChangePasswordUseCase } from "./change-password.use-case";
import { FetchMeUseCase } from "./fetch-me.use-case";
import { ForgotPasswordUseCase } from "./forgot-password.use-case";
import { LoginUseCase } from "./login.use-case";
import { RegisterUseCase } from "./register.use-case";
import { ResetPasswordUseCase } from "./reset-password.use-case";

const repo = new AuthRepository(appRequest);
const usersRepo = new UsersRepository(appRequest);

export const authUseCase = {
  login: new LoginUseCase(repo),
  register: new RegisterUseCase(repo),
  fetchMe: new FetchMeUseCase(repo),
  updateProfile: new UpdateProfileUseCase(usersRepo),
  forgotPassword: new ForgotPasswordUseCase(repo),
  resetPassword: new ResetPasswordUseCase(repo),
  changePassword: new ChangePasswordUseCase(repo),
};
