import { User } from "./user";

export type { ApiEnvelope } from "../utils/api-response";

// --- Legacy types (old backend) ---
// Kept only so modules that haven't been migrated to the new backend yet
// (e.g. wishlist.actions.ts) keep compiling. New code should use
// `ApiEnvelope<T>` from "@/lib/utils/api-response" instead.
export type ApiSuccessResponse = {
  message: "success";
  user: User;
  token: string;
};

export type ApiErrorResponse = {
  error: string;
};

export type ApiResponse = ApiSuccessResponse | ApiErrorResponse;
