import type { Product } from "./product";

export type CartItem = {
  product: Product;
  price: number;
  quantity: number;
  _id: string;
};

export type Cart = {
  user: string;
  cartItems: CartItem[];
  _id: string;
  appliedCoupons: string[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type CartResponse = {
  message: string;
  numOfCartItems: number;
  cart: Cart;
  price: number;
};

export type AddToCartItem = {
  product: string;
  quantity: number;
};
