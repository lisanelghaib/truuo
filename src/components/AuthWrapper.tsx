"use client";

import dynamic from "next/dynamic";
import { ReactNode } from "react";

// Dynamically import AuthProvider with SSR disabled
const AuthProvider = dynamic(
  () =>
    import("@/contexts/AuthContext").then((mod) => ({
      default: mod.AuthProvider,
    })),
  { ssr: false }
);

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  return <AuthProvider>{children}</AuthProvider>;
};
