import type { IReviewResponse } from '@ecommerce/shared';
import { Prisma } from '../../../../generated/prisma/client';

type ReviewWithUser = Prisma.ReviewGetPayload<{
  include: {
    user: {
      include: {
        avatar: {
          include: {
            image: true;
          };
        };
      };
    };
  };
}>;

export class ReviewResponseDto implements IReviewResponse {
  constructor(review: ReviewWithUser | null) {
    if (!review) return;

    const { user, ...rest } = review;
    const userResponse: NonNullable<IReviewResponse['user']> = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      avatar_id: user.avatar_id,
      avatar: user.avatar?.image ?? null,
    };
    Object.assign(this, {
      ...rest,
      user: userResponse,
    });
  }

  id: string;
  product_id: string;
  sku_id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  images: IReviewResponse['images'];
  created_at: Date;
  user?: IReviewResponse['user'];
}
