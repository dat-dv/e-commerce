import { BadRequestException, ForbiddenException, Injectable, Inject } from '@nestjs/common';
import { IReviewsRepository } from '../entities/reviews.repository.interface';
import { CreateReviewDto } from '../../dto/create-review.dto';

@Injectable()
export class CreateReviewUseCase {
  constructor(
    @Inject(IReviewsRepository)
    private readonly reviewsRepository: IReviewsRepository,
  ) {}

  async execute(userId: string, dto: CreateReviewDto) {
    const isSkuInProduct = await this.reviewsRepository.isSkuInProduct(dto.product_id, dto.sku_id);

    if (!isSkuInProduct) {
      throw new BadRequestException('SKU does not belong to the selected product');
    }

    const hasDeliveredPurchase = await this.reviewsRepository.hasDeliveredPurchase(userId, dto.product_id, dto.sku_id);

    if (!hasDeliveredPurchase) {
      throw new ForbiddenException('You can only review products from delivered orders');
    }

    return this.reviewsRepository.create({
      ...dto,
      user_id: userId,
    });
  }
}
