import type { Image, IUserAvatarResponse, UserAvatar } from '@ecommerce/shared';

type UserAvatarResponseInput = UserAvatar & {
  image: Image;
};

export class UserAvatarResponseDto implements IUserAvatarResponse {
  constructor(userAvatar: UserAvatarResponseInput, isCurrent: boolean) {
    Object.assign(this, {
      id: userAvatar.id,
      image_id: userAvatar.image_id,
      url: userAvatar.image.url,
      width: userAvatar.image.width,
      height: userAvatar.image.height,
      format: userAvatar.image.format,
      is_current: isCurrent,
      created_at: userAvatar.created_at,
    });
  }

  id: string;
  image_id: string;
  url: string;
  width: number | null;
  height: number | null;
  format: string | null;
  is_current: boolean;
  created_at: Date;
}
