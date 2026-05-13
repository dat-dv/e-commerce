export interface TCategory {
  id: string;
  slug: string;
  name: string;
  children?: TCategory[];
}
