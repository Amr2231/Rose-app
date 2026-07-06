import z from "zod";
import { Translations } from "../types/global";

export const AddOccasionSchema = (t: Translations) =>
  z.object({
    name: z
      .string()
      .nonempty(t("ocaasion-name-is-required"))
      .min(3, t("occasion-name-min")),
    image: z
      .instanceof(File, { message: "Image is required" })
      .refine((file) => file.size > 0, "Image is required")
      .refine(
        (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
        "Only JPG, PNG, or WEBP images are allowed"
      ),
  });

export type AddOccasionSchemaType = z.infer<
  ReturnType<typeof AddOccasionSchema>
>;

export const UpdateOccasionSchema = (t: Translations) =>
  z.object({
    name: z
      .string()
      .nonempty(t("ocaasion-name-is-required"))
      .min(3, t("occasion-name-min")),
  });

export type UpdateOccasionSchemaType = z.infer<
  ReturnType<typeof UpdateOccasionSchema>
>;
