"use server";

import {
  ChangePasswordPayload,
  ChangePasswordResponse,
  DeleteAccount,
  UpdateProfileField,
  UploadPhotoResponse,
  UserResponse,
} from "../types/account";
import { getToken } from "../utils/manage-token";
import { getServerApiBase } from "../utils/api-response";

// Update Profile Action
// NEW backend: PATCH /api/users/profile { firstName, lastName, photo, phone }
export async function updateProfileAction(field: UpdateProfileField) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(field),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to update profile");
  }

  // NOTE: response shape is { payload: { user } } and the new user object's
  // field names differ from the old one (id vs _id, uppercase enums) - the
  // UserResponse type/consumers will need a follow-up pass.
  return (data.payload ?? data) as UserResponse;
}

// Delete Account Action
// NEW backend: DELETE /api/users/account
export async function deleteAccountAction() {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/users/account`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to delete account");
  }

  return (data as DeleteAccount) ?? { message: "Account deleted" };
}

// Change Password Action
// NEW backend: POST (not PATCH) /api/users/change-password
// { currentPassword, newPassword, confirmPassword }
export async function changePasswordAction(field: ChangePasswordPayload) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const res = await fetch(`${getServerApiBase()}/api/users/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(field),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || data?.status === false) {
    throw new Error(data?.message ?? "Failed to change password");
  }

  return (data.payload ?? data) as ChangePasswordResponse;
}

// Upload Photo
// NEW backend has no dedicated "upload-photo" endpoint. Flow is now 2 steps:
//   1. POST /api/upload (multipart) -> { url: "/api/upload/temp/..." }
//   2. PATCH /api/users/profile { photo: url }
export async function uploadPhotoAction(formData: FormData) {
  const tokenObj = await getToken();
  const token = tokenObj?.accesstoken;

  const uploadRes = await fetch(`${getServerApiBase()}/api/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  const uploadData = await uploadRes.json().catch(() => null);

  if (!uploadRes.ok || uploadData?.status === false) {
    throw new Error(uploadData?.message ?? "Failed to upload photo");
  }

  const photoUrl: string | undefined = uploadData?.payload?.url;

  if (!photoUrl) {
    throw new Error("Upload succeeded but no URL was returned");
  }

  const profileRes = await fetch(`${getServerApiBase()}/api/users/profile`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ photo: photoUrl }),
  });

  const profileData = await profileRes.json().catch(() => null);

  if (!profileRes.ok || profileData?.status === false) {
    throw new Error(profileData?.message ?? "Failed to save photo to profile");
  }

  return { message: "Photo updated" } as UploadPhotoResponse;
}
