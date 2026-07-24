"use client";

import { useEffect } from "react";
import { useBreadcrumb } from "./breadcrumb-context";

export default function SetBreadcrumb({ label }: { label: string }) {
  const { setCustomLast } = useBreadcrumb();

  useEffect(() => {
    setCustomLast(label);

    return () => setCustomLast(undefined);
  }, [label, setCustomLast]);

  return null;
}
