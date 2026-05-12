// src/api/homepage/domain/infrastructure/homepage-section.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { EHomepageSectionType, IHomepageSection } from '../entities/homepage-section.entity';

@Injectable()
export class HomepageSectionRepository implements IHomepageSectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllEnabled(isLoggedIn: boolean = false): Promise<IHomepageSection[]> {
    const rows = await this.prisma.homepageSection.findMany({
      where: {
        is_enabled: true,
        ...(isLoggedIn ? {} : { require_login: false }),
      },
      orderBy: { order: 'asc' },
      include: {
        categories: {
          orderBy: { order: 'asc' },
        },
        translations: {
          include: {
            language: true,
          },
        },
      },
    });

    return rows.map((row) => {
      let sectionType: EHomepageSectionType = EHomepageSectionType.PRODUCT_CAROUSEL;
      if (row.type === 'flash_sale') {
        sectionType = EHomepageSectionType.FLASH_SALE;
      } else if (row.type === 'recommends') {
        sectionType = EHomepageSectionType.RECOMMENDS;
      } else if (row.type === 'recent_view') {
        sectionType = EHomepageSectionType.RECENT_VIEW;
      }

      return {
        id: row.id,
        type: sectionType,
        order: row.order,
        is_enabled: row.is_enabled,
        require_login: !!row.require_login,
        categories: row.categories,
        translations: row.translations,
        created_at: row.created_at,
        updated_at: row.updated_at,
      };
    });
  }
}
