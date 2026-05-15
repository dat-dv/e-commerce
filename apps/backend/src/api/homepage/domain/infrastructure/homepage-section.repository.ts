import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { IHomepageSection } from '@ecommerce/shared';

@Injectable()
export class HomepageSectionRepository implements IHomepageSectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllEnabled(isLoggedIn: boolean = false): Promise<IHomepageSection[]> {
    return this.prisma.homepageSection.findMany({
      where: {
        is_enabled: true,
        ...(isLoggedIn ? {} : { require_login: false }),
      },
      orderBy: { order: 'asc' },
      include: {
        categories: {
          orderBy: { order: 'asc' },
          include: {
            translations: true,
          },
        },
        translations: {
          include: {
            language: true,
          },
        },
      },
    });
  }
}
