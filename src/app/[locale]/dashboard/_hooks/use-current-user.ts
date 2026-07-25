"use client";

import { useSession } from "next-auth/react";
import { useMemo } from "react";

export function useCurrentUser() {
  const { data } = useSession();
  return useMemo(() => ({ user: data?.user }), [data?.user]);
}
