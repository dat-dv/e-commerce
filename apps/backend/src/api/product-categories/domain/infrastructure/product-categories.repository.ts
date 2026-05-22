import { ICategoryResponse, IPaginatedResult } from '@ecommerce/shared';
import { Injectable } from '@nestjs/common';
import { PaginationService } from 'src/shared/services/pagination/pagination.service';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import { CreateCategoryDto } from '../../dto/create-product-category.dto';
import { GetCategoriesDto } from '../../dto/get-categories.dto';
import { GetCategoryGroupsDto } from '../../dto/get-category-groups.dto';
import { UpdateCategoryDto } from '../../dto/update-product-category.dto';
import { IProductCategoriesRepository } from '../entities/product-categories.repository.interface';

@Injectable()
export class ProductCategoriesRepository implements IProductCategoriesRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  private getCategoryInclude(languageCode: string) {
    return {
      translations: {
        where: {
          language: {
            code: languageCode,
          },
        },
      },
      children: {
        include: {
          translations: {
            where: {
              language: {
                code: languageCode,
              },
            },
          },
        },
      },
    };
  }

  async create(data: CreateCategoryDto): Promise<ICategoryResponse> {
    const { translations, ...rest } = data;
    return this.prisma.productCategory.create({
      data: {
        ...rest,
        translations: {
          create: translations.map((t) => ({
            name: t.name,
            description: t.description,
            language: { connect: { id: t.language_id } },
          })),
        },
      },
      include: { translations: true, children: true },
    });
  }

  async update(id: string, data: UpdateCategoryDto): Promise<ICategoryResponse> {
    const { translations, ...rest } = data;
    return this.prisma.productCategory.update({
      where: { id },
      data: {
        ...rest,
        ...(translations && {
          translations: {
            deleteMany: {},
            create: translations.map((t) => ({
              name: t.name,
              description: t.description,
              language: { connect: { id: t.language_id } },
            })),
          },
        }),
      },
      include: { translations: true, children: true },
    });
  }

  async findMany(params?: GetCategoriesDto): Promise<IPaginatedResult<ICategoryResponse>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const result = await this.paginationService.paginate(
      this.prisma.productCategory,
      {
        where: { level: params?.level },
        include: { translations: true, children: true },
      },
      page,
      limit,
    );

    return result;
  }

  async findGroups(
    languageCode: string = 'vi',
    params?: GetCategoryGroupsDto,
  ): Promise<IPaginatedResult<ICategoryResponse>> {
    const page = params?.page || 1;
    const limit = params?.limit || 10;

    const result = await this.paginationService.paginate(
      this.prisma.productCategory,
      {
        where: {
          parent_id: null,
        },
        include: this.getCategoryInclude(languageCode),
      },
      page,
      limit,
    );

    return result;
  }

  async findById(id: string, languageCode: string = 'vi'): Promise<ICategoryResponse | null> {
    return this.prisma.productCategory.findUnique({
      where: { id },
      include: this.getCategoryInclude(languageCode),
    });
  }

  async findTree(languageCode: string = 'vi'): Promise<ICategoryResponse[]> {
    return this.prisma.productCategory.findMany({
      where: {
        parent_id: null,
      },
      include: this.getCategoryInclude(languageCode),
    });
  }

  async findTreeBySlug(slug: string, languageCode: string = 'vi'): Promise<ICategoryResponse | null> {
    return this.prisma.productCategory.findUnique({
      where: { slug },
      include: this.getCategoryInclude(languageCode),
    });
  }

  async delete(id: string): Promise<ICategoryResponse> {
    return this.prisma.productCategory.delete({
      where: { id },
      include: { translations: true, children: true },
    });
  }
}
