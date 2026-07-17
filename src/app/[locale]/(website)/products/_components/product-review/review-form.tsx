"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/tailwind-merge";
import { submitReviewAction } from "@/lib/actions/review.actions";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

// Type
type ReviewFormProps = {
  productId: string;
};

// Component
export default function ReviewForm({ productId }: ReviewFormProps) {
  const t = useTranslations("reviews.form");
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  // Schema
  const reviewSchema = z.object({
    rating: z
      .number({ error: t("validation.ratingRequired") })
      .min(1, t("validation.ratingRequired"))
      .max(5),
    title: z
      .string()
      .min(3, t("validation.titleMin"))
      .max(100, t("validation.titleMax")),
    comment: z
      .string()
      .min(10, t("validation.commentMin"))
      .max(500, t("validation.commentMax")),
  });

  type ReviewFormData = z.infer<typeof reviewSchema>;

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, title: "", comment: "" },
  });

  const { isSubmitting } = form.formState;

  // Submit
  async function onSubmit(values: ReviewFormData) {
    setServerError("");
    setSuccess(false);

    try {
      await submitReviewAction({
        product: productId,
        rating: values.rating,
        title: values.title,
        comment: values.comment,
      });
      form.reset();
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    }
  }

  return (
    <div className="w-full lg:w-[32.5rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          {/* Rating */}
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <FormLabel className="text-lg font-medium">
                    {t("yourRating")}
                  </FormLabel>
                  <FormControl>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          onClick={() => field.onChange(star)}
                          className={cn(
                            "w-5 h-5 cursor-pointer transition-colors",
                            star <= field.value
                              ? "fill-amber-500 text-amber-500"
                              : "text-gray-300 dark:text-zinc-600"
                          )}
                        />
                      ))}
                    </div>
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("titleLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("titlePlaceholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Comment */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("reviewLabel")}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder={t("reviewPlaceholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-red-600 dark:text-red-400 text-sm text-center">{serverError}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md p-3">
              <p className="text-green-600 dark:text-green-400 text-sm text-center">
                {t("success")}
              </p>
            </div>
          )}

          {/* Submit */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            )}
            {isSubmitting ? t("submitting") : t("submit")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
