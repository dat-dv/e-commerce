// src/api/homepage/domain/infrastructure/homepage-section.repository.ts

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { IHomepageSectionRepository } from '../entities/homepage-section.repository.interface';
import { IHomepageSection } from '../entities/homepage-section.entity';

@Injectable()
export class HomepageSectionRepository implements IHomepageSectionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllEnabled(): Promise<IHomepageSection[]> {
    const rows = await this.prisma.homepageSection.findMany({
      where: { is_enabled: true },
      orderBy: { order: 'asc' },
    });

    return rows.map((row) => ({
      ...row,
      params: row.params ? (JSON.parse(row.params) as Record<string, string>) : null,
    }));
  }
}
