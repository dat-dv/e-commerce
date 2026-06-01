import type { Image, IUserAvatarResponse, UserAvatar } from '@ecommerce/shared';

type UserAvatarResponseInput = UserAvatar & {
  image: Image;
};

export class UserAvatarResponseDto implements IUserAvatarResponse {
  constructor(userAvatar: UserAvatarResponseInput, isCurrent: boolean) {
    Object.assign(this, {
      ...userAvatar,
      is_current: isCurrent,
    });
  }

  id: string;
  user_id: string;
  image_id: string;
  created_at: Date;
  image: Image;
  is_current: boolean;
}
