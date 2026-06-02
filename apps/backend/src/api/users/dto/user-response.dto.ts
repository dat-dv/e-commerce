import type { Image, IRoleResponse, IUserResponse, UserPhone } from '@ecommerce/shared';

type UserResponseInput = Omit<Partial<IUserResponse>, 'avatar'> & {
  avatar?: Image | ({ image?: Image | null } & Record<string, unknown>) | null;
};

export class UserResponseDto implements IUserResponse {
  constructor(user?: UserResponseInput | null) {
    if (!user) return;

    const { avatar, ...rest } = user;
    Object.assign(this, {
      ...rest,
      avatar: this.resolveAvatar(avatar),
    });
  }

  private resolveAvatar(avatar: UserResponseInput['avatar']): Image | null | undefined {
    if (!avatar) return avatar;
    if (this.isImage(avatar)) return avatar;
    return avatar.image ?? null;
  }

  private isImage(avatar: NonNullable<UserResponseInput['avatar']>): avatar is Image {
    return 'url' in avatar && 'public_id' in avatar;
  }

  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  password: string;
  date_of_birth: Date | null;
  gender: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  role_id: string | null;
  avatar_id: string | null;
  active_phone_id: string | null;
  role?: IRoleResponse | null;
  avatar?: Image | null;
  active_phone?: UserPhone | null;
  phones?: UserPhone[];
}
