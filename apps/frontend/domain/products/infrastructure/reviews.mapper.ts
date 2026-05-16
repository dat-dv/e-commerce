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
        name: dto.user
          ? `${dto.user.first_name || ""} ${dto.user.last_name || ""}`.trim()
          : "Anonymous",
        avatarUrl: dto.user?.avatar?.url || undefined,
      },
      rating: dto.rating,
      comment: dto.comment || undefined,
      images: (dto.images as unknown as string[]) || [],
      createdAt:
        dto.created_at instanceof Date
          ? dto.created_at.toISOString()
          : String(dto.created_at),
    };
  }
}
