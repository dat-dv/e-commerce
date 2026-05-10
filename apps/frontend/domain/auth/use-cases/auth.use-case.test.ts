import { beforeEach, describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { TUser } from "../model/auth.model";
import { IAuthRepository } from "../model/auth.repository";
import { FetchMeUseCase } from "./fetch-me.use-case";
import { LoginUseCase } from "./login.use-case";
import { RegisterUseCase } from "./register.use-case";
import { UpdateProfileUseCase } from "./update-profile.use-case";

describe("Auth Use Cases", () => {
  let mockRepo: IAuthRepository;

  const mockUser: TUser = {
    id: "user-123",
    name: "John Doe",
    email: "john@example.com",
  };

  beforeEach(() => {
    mockRepo = {
      login: vi.fn(),
      register: vi.fn(),
      fetchMe: vi.fn(),
      updateProfile: vi.fn(),
      logout: vi.fn(),
    };
  });

  describe("LoginUseCase", () => {
    it("should login successfully with valid credentials", async () => {
      const useCase = new LoginUseCase(mockRepo);
      const credentials = {
        email: "john@example.com",
        password: "password123",
      };
      vi.mocked(mockRepo.login).mockResolvedValue(mockUser);

      const result = await useCase.execute(credentials);

      expect(result).toEqual(mockUser);
      expect(mockRepo.login).toHaveBeenCalledWith(credentials);
    });

    it("should throw ZodError with invalid email", async () => {
      const useCase = new LoginUseCase(mockRepo);
      try {
        await useCase.execute({
          email: "invalid-email",
          password: "password123",
        });
      } catch (err) {
        expect(err).toBeInstanceOf(ZodError);
        const zodError = err as ZodError;
        expect(zodError.issues[0].message).toBe("Invalid email address");
      }
    });
  });

  describe("RegisterUseCase", () => {
    it("should register successfully with valid data", async () => {
      const useCase = new RegisterUseCase(mockRepo);
      const data = {
        email: "new@example.com",
        password: "password123",
        fullName: "New User",
      };
      vi.mocked(mockRepo.register).mockResolvedValue(undefined);

      await useCase.execute(data);

      expect(mockRepo.register).toHaveBeenCalledWith(data);
    });
  });

  describe("FetchMeUseCase", () => {
    it("should fetch current user", async () => {
      const useCase = new FetchMeUseCase(mockRepo);
      vi.mocked(mockRepo.fetchMe).mockResolvedValue(mockUser);

      const result = await useCase.execute();

      expect(result).toEqual(mockUser);
      expect(mockRepo.fetchMe).toHaveBeenCalled();
    });
  });

  describe("UpdateProfileUseCase", () => {
    it("should update partial profile successfully", async () => {
      const useCase = new UpdateProfileUseCase(mockRepo);
      const patch = { name: "Updated Name" };
      vi.mocked(mockRepo.updateProfile).mockResolvedValue({
        ...mockUser,
        name: "Updated Name",
      });

      const result = await useCase.execute(patch);

      expect(result.name).toBe("Updated Name");
      expect(mockRepo.updateProfile).toHaveBeenCalledWith(
        expect.objectContaining(patch),
      );
    });
  });
});
