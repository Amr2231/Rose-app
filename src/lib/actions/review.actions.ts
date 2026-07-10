"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { createReview } from "@/lib/services/reviews.service";
import { revalidatePath } from "next/cache";

// Types
interface ReviewPayload {
  product: string;
  rating: number;
  title: string;
  comment: string;
}

// Action
export async function submitReviewAction(payload: ReviewPayload) {
  const session = await getServerSession(authOptions);

  // Unauthorized
  const token = (session?.user as any)?.accesstoken;
  if (!token) {
    throw new Error("Please logout and login again");
  }

  // Submit
  await createReview(token, payload);

  // Revalidate product page
  revalidatePath("/", "layout");
}
