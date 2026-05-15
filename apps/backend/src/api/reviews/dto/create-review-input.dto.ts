import { CreateReviewDto } from './create-review.dto';

export class CreateReviewInputDto extends CreateReviewDto {
  user_id: string;
}
