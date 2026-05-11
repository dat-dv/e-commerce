import { appRequest } from "@/utils/request/request";

import { AuthRepository } from "../infrastructure/auth.repository";
import { FetchMeUseCase } from "./fetch-me.use-case";
import { LoginUseCase } from "./login.use-case";
import { RegisterUseCase } from "./register.use-case";
import { UpdateProfileUseCase } from "./update-profile.use-case";
import { ForgotPasswordUseCase } from "./forgot-password.use-case";
import { ResetPasswordUseCase } from "./reset-password.use-case";

const repo = new AuthRepository(appRequest);

export const authUseCase = {
  login: new LoginUseCase(repo),
  register: new RegisterUseCase(repo),
  fetchMe: new FetchMeUseCase(repo),
  updateProfile: new UpdateProfileUseCase(repo),
  forgotPassword: new ForgotPasswordUseCase(repo),
  resetPassword: new ResetPasswordUseCase(repo),
};
