import {
  IGetAllCategoriesRequest,
  IGetCategoryGroupsRequest,
} from "@ecommerce/shared";

export interface TCategory {
  id: string;
  slug: string;
  name: string;
  children?: TCategory[];
}

export type TGetCategoriesRequest = IGetAllCategoriesRequest;

export type TGetGroupsRequest = IGetCategoryGroupsRequest;
