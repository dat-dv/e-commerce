export interface ICategory {
  id: string;
  slug: string;
  name: string;
  children?: ICategory[];
}
