import type { ILanguageListResponse } from '@ecommerce/shared';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { ILanguagesRepository } from '../entities/languages.repository.interface';

@Injectable()
export class LanguagesRepository implements ILanguagesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<ILanguageListResponse> {
    return this.prisma.language.findMany({
      orderBy: {
        code: 'asc',
      },
    });
  }
}
