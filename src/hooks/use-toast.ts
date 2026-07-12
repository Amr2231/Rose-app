"use client";

import * as React from "react";
import { ToastContext } from "@/context/toast-context";

export const useToast = () => {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastContextProvider");
  }

  return context;
};
