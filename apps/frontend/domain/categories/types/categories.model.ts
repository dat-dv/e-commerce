export interface TCategory {
  id: string;
  slug: string;
  name: string;
  children?: TCategory[];
}

export type TGetCategoriesRequest = {
  page?: number;
  limit?: number;
  level?: number;
};

export type TGetGroupsRequest = {
  page?: number;
  limit?: number;
};
