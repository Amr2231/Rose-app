import z from "zod";
import { productSchema, productUpdateSchema } from "../schemas/product.schema";
import { Occasion } from "./occasion";

export type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  imgCover: string;
  images: string[];
  price: number;
  priceAfterDiscount: number;
  quantity: number;
  category: string;
  occasion: string;
  createdAt: string;
  updatedAt: string;
  sold: number;
  rateAvg: number;
  rateCount: number;
  favoriteId: string | null;
  isInWishlist: boolean;
  isSuperAdmin?: boolean;
  discount?: number;
};

export type ProductCardProps = {
  id?: string;
  img: string;
  title: string;
  price: number;
  priceAfterDiscount: number;
  quantity: number;
  sold: number;
  rateAvg: number;
};
type ProductsParams = {
  sort?: string;
  limit?: number;
  occasion?: string;
};
type ProductsResponse = {
  products: Product[];
  total?: number;
};

export type MostPopularProductsProps = {
  initialProducts: ProductsResponse;
  initialOccasion: string;
  occasions: Occasion[];
};
export type ProductBadgeProps = {
  quantity: number;
  sold?: number;
};

export type ProductRatingProps = {
  rate: number;
};

export type ProductDetailsResponse = {
  message: string;
  product: Product;
};

export type ProductFields = z.infer<ReturnType<typeof productSchema>>;
export type ProductUpdateFields = z.infer<ReturnType<typeof productUpdateSchema>>;
