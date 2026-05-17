import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { IHomepageSection } from '@ecommerce/shared';

@Injectable()
export class HomepageSectionRepository implements IHomepageSectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllEnabled(params?: {
    languageCode?: string;
    isLoggedIn?: boolean;
    page?: number;
    limit?: number;
  }): Promise<IHomepageSection[]> {
    const { languageCode = 'vi', isLoggedIn = false, page = 1, limit = 10 } = params || {};

    return this.prisma.homepageSection.findMany({
      where: {
        is_enabled: true,
        type: 'product_carousel',
        ...(isLoggedIn ? {} : { require_login: false }),
      },
      orderBy: { order: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        categories: {
          orderBy: { order: 'asc' },
          include: {
            translations: {
              where: { language: { code: languageCode } },
            },
          },
        },
        translations: {
          where: { language: { code: languageCode } },
        },
      },
    });
  }
}
