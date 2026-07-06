// Category entity
export interface Category {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  isSuperAdmin: boolean;
  productsCount: number;
}

export interface CategoriesResponse {
  message: string;
  metadata: PaginationMetadata;
  categories: Category[];
}

export type ActionCategoryResponse = {
  message: string;
  document?: {
    _id: string;
    name: string;
    slug: string;
    image: string;
    isSuperAdmin: boolean;
    createdAt: string;
    updatedAt: string;
  };
};
