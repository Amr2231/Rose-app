import z from "zod";
import { Translations } from "../types/global";

export const productSchema = (t: Translations) =>
  z.object({
    title: z.string().nonempty(t("title-required")),
    description: z.string().nonempty(t("description-required")),
    price: z.number().min(1, t("price-required")),
    discount: z.number().optional(),
    priceAfterDiscount: z.number().optional(),
    quantity: z.string().nonempty(t("quantity-required")),
    imageCover: z
      .instanceof(File)
      .refine((file) => file.type.startsWith("image/"), {
        message: t("product-cover-required"),
      }),
    gallery: z.array(
      z.instanceof(File).refine((file) => file.type.startsWith("image/"), {
        message: t("product-gallery-required"),
      })
    ),
    category: z.string().nonempty(t("select-category")),
    occasion: z.string().nonempty(t("select-occasion")),
  });

export const productUpdateSchema = (t: Translations) =>
  z.object({
    title: z.string().nonempty(t("title-required")),
    description: z.string().nonempty(t("description-required")),
    price: z.number().min(1, t("price-required")),
    discount: z.number().optional(),
    priceAfterDiscount: z.number().optional(),
    quantity: z.string().nonempty(t("quantity-required")),
    category: z.string().nonempty(t("select-category")),
    occasion: z.string().nonempty(t("select-occasion")).optional(),
  });
