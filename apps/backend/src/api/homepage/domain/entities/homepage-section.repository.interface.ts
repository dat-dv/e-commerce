import { IHomepageSection } from '@ecommerce/shared';

export interface IHomepageSectionRepository {
  findAllEnabled(languageCode?: string, isLoggedIn?: boolean): Promise<IHomepageSection[]>;
}

export const IHomepageSectionRepository = Symbol('IHomepageSectionRepository');
