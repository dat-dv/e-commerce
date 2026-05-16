// src/api/homepage/homepage.module.ts

import { Module } from '@nestjs/common';
import { HomepageController } from './homepage.controller';
import { GetHomepageSectionsUseCase } from './domain/use-cases/get-homepage-sections.use-case';
import { HomepageSectionRepository } from './domain/infrastructure/homepage-section.repository';
import { IHomepageSectionRepository } from './domain/entities/homepage-section.repository.interface';
import { ProductsModule } from 'src/api/products/products.module';
import { BrandsModule } from '../brands/brands.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [ProductsModule, BrandsModule, AuthModule],
  controllers: [HomepageController],
  providers: [
    GetHomepageSectionsUseCase,
    {
      provide: IHomepageSectionRepository,
      useClass: HomepageSectionRepository,
    },
  ],
})
export class HomepageModule {}
