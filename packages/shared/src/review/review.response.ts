import type { Review, User, Image } from "../generate/browser";

export interface IReviewResponse extends Review {
  user?: Pick<User, "id" | "first_name" | "last_name" | "avatar_id"> & {
    avatar?: Image | null;
  };
}

export type IReviewListResponse = IReviewResponse[];
