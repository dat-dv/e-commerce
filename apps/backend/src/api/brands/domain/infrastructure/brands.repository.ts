import { Injectable } from '@nestjs/common';
import { IBrandsRepository } from '../entities/brands.repository.interface';
import { IBrand } from '@ecommerce/shared';
import { PrismaService } from 'src/shared/services/prisma/prisma.service';
import {
  PaginationService,
  PaginatedResult,
  PrismaModelDelegate,
} from 'src/shared/services/pagination/pagination.service';
interface IBrandFromPrisma {
  id: string;
  slug: string;
  logo_url: string | null;
  banner_url: string | null;
  website_url: string | null;
  founded_year: number | null;
  headquarters: string | null;
  is_verified: boolean;
  is_featured: boolean;
  order: number;
  translations: {
    name: string;
    description: string | null;
    story: string | null;
  }[];
}

@Injectable()
export class BrandsRepository implements IBrandsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
  ) {}

  async getTopBrands(page = 1, limit = 10, languageCode = 'en'): Promise<PaginatedResult<IBrand>> {
    const result = await this.paginationService.paginate<IBrandFromPrisma>(
      this.prisma.brand,
      {
        where: { is_featured: true },
        orderBy: { order: 'asc' },
        include: {
          translations: {
            where: {
              language: { code: languageCode },
            },
          },
        },
      },
      page,
      limit,
    );

    return {
      ...result,
      items: result.items.map((brand): IBrand => {
        const translation = brand.translations?.[0];
        return {
          id: brand.id,
          slug: brand.slug,
          logo_url: brand.logo_url,
          banner_url: brand.banner_url,
          website_url: brand.website_url,
          is_verified: brand.is_verified,
          is_featured: brand.is_featured,
          order: brand.order,
          name: translation?.name || brand.slug,
          description: translation?.description,
          story_vi: translation?.story, // simplistic mapping for now
          founded_year: brand.founded_year,
          headquarters: brand.headquarters,
        };
      }),
    };
  }

  async getBrandBySlug(slug: string, languageCode = 'en'): Promise<IBrand | null> {
    const brand = await this.prisma.brand.findUnique({
      where: { slug },
      include: {
        translations: {
          where: {
            language: { code: languageCode },
          },
        },
      },
    });

    if (!brand) return null;

    const translation = brand.translations?.[0];
    return {
      id: brand.id,
      slug: brand.slug,
      logo_url: brand.logo_url,
      banner_url: brand.banner_url,
      website_url: brand.website_url,
      is_verified: brand.is_verified,
      is_featured: brand.is_featured,
      order: brand.order,
      name: translation?.name || brand.slug,
      description: translation?.description,
      story_vi: translation?.story,
      founded_year: brand.founded_year,
      headquarters: brand.headquarters,
    };
  }

  async getBrandProducts(slug: string, page = 1, limit = 20, languageCode = 'en'): Promise<PaginatedResult<any>> {
    return this.paginationService.paginate(
      this.prisma.product,
      {
        where: {
          brand: { slug },
        },
        include: {
          skus: true,
          category: true,
        },
        orderBy: { created_at: 'desc' },
      },
      page,
      limit,
    );
  }
}
