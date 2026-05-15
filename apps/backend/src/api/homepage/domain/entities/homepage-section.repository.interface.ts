import { HomepageSection, Prisma } from '../../../../../generated/prisma/client';

export type HomepageSectionWithDetails = Prisma.HomepageSectionGetPayload<{
  include: {
    categories: {
      include: {
        translations: true;
      };
    };
    translations: {
      include: {
        language: true;
      };
    };
  };
}>;

export interface IHomepageSectionRepository {
  findAllEnabled(isLoggedIn?: boolean): Promise<HomepageSectionWithDetails[]>;
}

export const IHomepageSectionRepository = Symbol('IHomepageSectionRepository');
