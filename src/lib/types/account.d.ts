import z from "zod";
import {
  ChangePasswordBackendSchema,
  ChangePasswordSchema,
  UpdateProfileSchema,
} from "../schemas/account.schema";
import { User } from "./user";

// Matches the new backend's actual GET/PATCH /api/users/profile response
// ({ payload: { user } }) - previously declared with the OLD backend's shape
// (_id, lowercase gender/role, embedded wishlist/addresses), which doesn't
// exist on the new API and made TypeScript lie about what's really there.
export type UserResponse = {
  message?: string;
  user: User;
};

export type UpdateProfileField = z.infer<
  ReturnType<typeof UpdateProfileSchema>
>;

export type DeleteAccount = {
  message: string;
};

export type ChangePasswordField = z.infer<
  ReturnType<typeof ChangePasswordSchema>
>;

export type ChangePasswordPayload = z.infer<
  ReturnType<typeof ChangePasswordBackendSchema>
>;

export type ChangePasswordResponse = {
  message: string;
  token: string;
};

export type Photo = string;

export type UploadPhotoResponse = {
  message: string;
};
