"use client";

import { createContext, useContext, useState } from "react";

type BreadcrumbContextType = {
  customLast?: string;
  setCustomLast: (value?: string) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [customLast, setCustomLast] = useState<string | undefined>();

  return (
    <BreadcrumbContext.Provider value={{ customLast, setCustomLast }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const ctx = useContext(BreadcrumbContext);

  if (!ctx) {
    throw new Error("useBreadcrumb must be used inside BreadcrumbProvider");
  }

  return ctx;
}
