"use client";

import * as React from "react";
import type { ToastActionElement, ToastProps } from "@/components/ui/toast";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type Action =
  | { type: "ADD_TOAST"; toast: ToasterToast }
  | { type: "UPDATE_TOAST"; toast: Partial<ToasterToast> & { id: string } }
  | { type: "DISMISS_TOAST"; toastId?: string }
  | { type: "REMOVE_TOAST"; toastId?: string };

interface ToastContextType {
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, "id">) => {
    id: string;
    dismiss: () => void;
    update: (props: Partial<ToasterToast>) => void;
  };
  dismiss: (toastId?: string) => void;
}

export const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const dispatch = (action: Action) => {
    setToasts((prev) => {
      switch (action.type) {
        case "ADD_TOAST":
          return [action.toast, ...prev].slice(0, TOAST_LIMIT);
        case "UPDATE_TOAST":
          return prev.map((t) =>
            t.id === action.toast.id ? { ...t, ...action.toast } : t
          );
        case "DISMISS_TOAST":
          if (action.toastId) {
            setTimeout(
              () => dispatch({ type: "REMOVE_TOAST", toastId: action.toastId }),
              TOAST_REMOVE_DELAY
            );
          }
          return prev.map((t) =>
            t.id === action.toastId || action.toastId === undefined
              ? { ...t, open: false }
              : t
          );
        case "REMOVE_TOAST":
          return action.toastId === undefined
            ? []
            : prev.filter((t) => t.id !== action.toastId);
      }
    });
  };

  const toast = (props: Omit<ToasterToast, "id">) => {
    const id = (Date.now() + Math.random()).toString();
    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
    const update = (props: Partial<ToasterToast>) =>
      dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });

    dispatch({
      type: "ADD_TOAST",
      toast: {
        ...props,
        id,
        open: true,
        onOpenChange: (open: boolean) => !open && dismiss(),
      },
    });

    return { id, dismiss, update };
  };

  const value = {
    toasts,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  };

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}
