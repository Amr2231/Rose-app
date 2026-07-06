import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  image: z.any().refine((files) => files?.length > 0, "Image is required"),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
});
export type CreateCategoryValues = z.infer<typeof createCategorySchema>;
export type UpdateCategoryValues = z.infer<typeof updateCategorySchema>;
