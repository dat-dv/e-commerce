import { Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { IBrand } from 'src/api/homepage/domain/entities/homepage-section.entity';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
  PaginationService,
  PaginatedResult,
  PrismaModelDelegate,
} from 'src/shared/services/pagination/pagination.service';

@Injectable()
export class BrandsRepository implements IBrandsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getTopBrands(page = 1, limit = 10, languageCode = 'en'): Promise<PaginatedResult<IBrand>> {
    const result = await this.paginationService.paginate<IBrand>(
      this.prisma.brand,
      {
        where: { is_featured: true },
        orderBy: { order: 'asc' },
      },
      page,
      limit,
    );

    return result;
  }
}
