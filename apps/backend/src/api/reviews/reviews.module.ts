import { forwardRef, Module } from '@nestjs/common';
import { ReviewsController } from './reviews.controller';
import { CreateReviewUseCase } from './domain/use-cases/create-review.use-case';
import { UpdateReviewUseCase } from './domain/use-cases/update-review.use-case';
import { GetReviewsUseCase } from './domain/use-cases/get-reviews.use-case';
import { DeleteReviewUseCase } from './domain/use-cases/delete-review.use-case';
import { IReviewsRepository } from './domain/entities/reviews.repository.interface';
import { ReviewsRepository } from './domain/infrastructure/reviews.repository';
import { AuthModule } from 'src/api/auth/auth.module';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [ReviewsController],
  providers: [
    CreateReviewUseCase,
    UpdateReviewUseCase,
    GetReviewsUseCase,
    DeleteReviewUseCase,
    {
      provide: IReviewsRepository,
      useClass: ReviewsRepository,
    },
  ],
  exports: [CreateReviewUseCase, UpdateReviewUseCase, GetReviewsUseCase, DeleteReviewUseCase, IReviewsRepository],
})
export class ReviewsModule {}
