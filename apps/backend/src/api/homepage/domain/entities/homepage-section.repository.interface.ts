// src/api/homepage/domain/entities/homepage-section.repository.interface.ts

import { IHomepageSection } from './homepage-section.entity';

export interface IHomepageSectionRepository {
  findAllEnabled(isLoggedIn?: boolean): Promise<IHomepageSection[]>;
}

export const IHomepageSectionRepository = Symbol('IHomepageSectionRepository');
