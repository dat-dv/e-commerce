import { IHomepageSection } from '@ecommerce/shared';

export interface IHomepageSectionRepository {
  findAllEnabled(params?: {
    languageCode?: string;
    isLoggedIn?: boolean;
    page?: number;
    limit?: number;
  }): Promise<IHomepageSection[]>;
}

export const IHomepageSectionRepository = Symbol('IHomepageSectionRepository');
