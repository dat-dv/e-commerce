import { TReview } from "../types/products.model";
import { IReviewResponse } from "@ecommerce/shared";

export class ReviewMapper {
  static toDomain(dto: IReviewResponse): TReview {
    return {
      id: dto.id,
      productId: dto.product_id,
      userId: dto.user_id,
      user: {
        id: dto.user?.id || "",
        name: dto.user?.name || "Anonymous",
        avatarUrl: dto.user?.avatar_url || undefined,
      },
      rating: dto.rating,
      comment: dto.comment || undefined,
      images: dto.images || [],
      createdAt: dto.created_at,
    };
  }
}
