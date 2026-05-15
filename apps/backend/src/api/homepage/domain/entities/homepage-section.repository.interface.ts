import { IHomepageSection } from '@ecommerce/shared';

export interface IHomepageSectionRepository {
  findAllEnabled(isLoggedIn?: boolean): Promise<IHomepageSection[]>;
}

export const IHomepageSectionRepository = Symbol('IHomepageSectionRepository');
