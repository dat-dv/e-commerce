import { IHomepageFeaturedCategory } from '@ecommerce/shared';

export interface IHomepageSectionRepository {
  findAllEnabled(params?: {
    languageCode?: string;
    isLoggedIn?: boolean;
    page?: number;
    limit?: number;
  }): Promise<IHomepageFeaturedCategory[]>;
}

export const IHomepageSectionRepository = Symbol('IHomepageSectionRepository');
