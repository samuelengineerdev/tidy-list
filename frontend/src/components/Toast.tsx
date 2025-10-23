// src/components/Toast.tsx
import { CheckCircle, XCircle, Info } from "lucide-react";
import { toast, Toaster, type ExternalToast } from "sonner";
import React from "react";

// Helper to use CSS vars from your design system
const cssVar = (name: string) => `hsl(var(--${name}))`;

type Message = string | React.ReactNode;

export const Toast = {
  success: (message: Message, data?: ExternalToast) =>
    toast.success(message, {
      style: {
        background: cssVar("card"),
        color: cssVar("card-foreground"),
        border: `1px solid ${cssVar("primary")}`,
      },
      icon: <CheckCircle style={{ color: cssVar("primary") }} />,
    }),

  error: (message: Message, data?: ExternalToast) =>
    toast.error(message, {
      style: {
        background: cssVar("card"),
        color: cssVar("card-foreground"),
        border: `1px solid ${cssVar("destructive")}`,
      },
      icon: <XCircle style={{ color: cssVar("destructive") }} />,
    }),

  info: (message: Message, data?: ExternalToast) =>
    toast(message, {
      style: {
        background: cssVar("card"),
        color: cssVar("card-foreground"),
        border: `1px solid ${cssVar("secondary")}`,
      },
      icon: <Info style={{ color: cssVar("secondary") }} />,
    }),
};

// Place this component inside your App to enable toasts
export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          fontSize: "14px",
          borderRadius: "var(--radius)",
          padding: "10px 14px",
        },
      }}
    />
  );
};
