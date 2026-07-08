import * as z from "zod";

export const priceSchema = z
  .object({
    minPrice: z
      .string()
      .refine((val) => !val || !isNaN(Number(val)), "Numbers only"),
    maxPrice: z
      .string()
      .refine((val) => !val || !isNaN(Number(val)), "Numbers only"),
  })
  .refine(
    (data) => {
      if (data.minPrice && data.maxPrice) {
        return Number(data.minPrice) <= Number(data.maxPrice);
      }
      return true;
    },
    {
      message: "Invalid range",
      path: ["maxPrice"],
    }
  );

export type PriceFormValues = z.infer<typeof priceSchema>;
