import { Injectable, Inject } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';
import { CreateReviewDto } from '../../dto/create-review.dto';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async execute(userId: string, dto: CreateReviewDto) {
    // TODO: Kiểm tra xem người dùng đã mua sản phẩm này chưa (đơn hàng phải ở trạng thái DELIVERED).
    // Nếu chưa mua hoặc chưa nhận hàng thì không được đánh giá.

    return this.reviewsRepository.create({
      ...dto,
      user_id: userId,
    });
  }
}
