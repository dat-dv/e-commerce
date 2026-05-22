export interface ICreateCategoryRequest {
  slug: string;
  parent_id?: string;
  order?: number;
  is_active?: boolean;
  translations: {
    language_id: string;
    name: string;
    description?: string;
  }[];
}

export interface IUpdateCategoryRequest {
  slug?: string;
  parent_id?: string;
  order?: number;
  is_active?: boolean;
  translations?: {
    language_id: string;
    name: string;
    description?: string;
  }[];
}

export interface IGetAllCategoriesRequest {
  page?: number;
  limit?: number;
  level?: number;
}

export interface IGetCategoryGroupsRequest {
  page?: number;
  limit?: number;
}
