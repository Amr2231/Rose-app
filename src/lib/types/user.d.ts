// Matches the payload.user shape returned by the new backend
// (GET /api/users/profile, /api/auth/login, /api/auth/register, ...)
export interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  gender: "MALE" | "FEMALE";
  photo?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}
