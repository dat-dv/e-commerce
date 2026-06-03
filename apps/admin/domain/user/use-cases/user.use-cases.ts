import { type IAdminUserRepository } from "../types/user.repository";

export class AdminGetUsersUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(params: Parameters<IAdminUserRepository["getUsers"]>[0]) {
    return this.userRepository.getUsers(params);
  }
}

export class AdminGetUserUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(id: string) {
    return this.userRepository.getUser(id);
  }
}

export class AdminGetUserAvatarsUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(id: string) {
    return this.userRepository.getUserAvatars(id);
  }
}

export class AdminGetUserOrdersUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(id: string, params?: { page?: number; limit?: number }) {
    return this.userRepository.getUserOrders(id, params);
  }
}

export class AdminGetUserCartUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(id: string) {
    return this.userRepository.getUserCart(id);
  }
}

export class AdminGetUserFavoritesUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(id: string, params?: { page?: number; limit?: number }) {
    return this.userRepository.getUserFavorites(id, params);
  }
}

export class AdminUpdateUserUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(
    id: string,
    data: Parameters<IAdminUserRepository["updateUser"]>[1],
  ) {
    return this.userRepository.updateUser(id, data);
  }
}

export class AdminDeleteUserUseCase {
  constructor(private readonly userRepository: IAdminUserRepository) {}

  async execute(id: string) {
    return this.userRepository.deleteUser(id);
  }
}
