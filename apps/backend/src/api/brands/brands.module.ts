import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { GetTopBrandsUseCase } from './domain/use-cases/get-top-brands.use-case';
import { IBrandsRepository } from './domain/entities/brands.repository.interface';
import { BrandsRepository } from './domain/infrastructure/brands.repository';

@Module({
  controllers: [BrandsController],
  providers: [
    GetTopBrandsUseCase,
    {
      provide: IBrandsRepository,
      useClass: BrandsRepository,
    },
  ],
  exports: [GetTopBrandsUseCase, IBrandsRepository],
})
export class BrandsModule {}
