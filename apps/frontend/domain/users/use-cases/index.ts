import { appRequest } from "@/constants/app-request";
import { UpdateProfileUseCase } from "@/domain/users/use-cases/update-profile.use-case";
import { UsersRepository } from "../infrastructure/users.repository";
import { UpdateProfileAvatarUseCase } from "./update-profile-avatar.use-case";

const repo = new UsersRepository(appRequest);

export const usersUseCase = {
  updateProfile: new UpdateProfileUseCase(repo),
  uploadAvatar: new UpdateProfileAvatarUseCase(repo),
};
