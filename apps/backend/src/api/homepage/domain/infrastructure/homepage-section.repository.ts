import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { IHomepageFeaturedCategory } from '@ecommerce/shared';

@Injectable()
export class HomepageSectionRepository implements IHomepageSectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllEnabled(params?: {
    languageCode?: string;
    isLoggedIn?: boolean;
    page?: number;
    limit?: number;
  }): Promise<IHomepageFeaturedCategory[]> {
    const { languageCode = 'en', page = 1, limit = 10 } = params || {};

    return this.prisma.featuredCategory.findMany({
      where: {
        is_active: true,
        category: {
          is_active: true,
        },
      },
      orderBy: { order: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        category: {
          include: {
            translations: {
              where: { language: { code: languageCode } },
            },
          },
        },
      },
    });
  }
}
