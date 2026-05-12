export interface ICategoryTranslationResponse {
  name: string;
}

export interface ICategoryResponse {
  id: string;
  slug: string;
  translations?: ICategoryTranslationResponse[];
  children?: ICategoryResponse[];
}
