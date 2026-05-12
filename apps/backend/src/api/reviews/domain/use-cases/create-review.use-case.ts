import { Injectable, Inject } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async execute(data: { product_id: string; sku_id: string; user_id: string; rating: number; comment?: string; images?: string[] }) {
    // TODO: Kiểm tra xem người dùng đã mua sản phẩm này chưa (đơn hàng phải ở trạng thái DELIVERED).
    // Nếu chưa mua hoặc chưa nhận hàng thì không được đánh giá.
    
    return this.reviewsRepository.create(data);
  }
}
