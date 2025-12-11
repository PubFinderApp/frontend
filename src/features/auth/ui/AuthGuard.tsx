"use client";

import { useAuth } from "@/features/auth/model/useAuth";
import type { ReactNode } from "react";
import Link from "next/link";

export type AuthGuardProps = {
  children: ReactNode;
  fallbackMessage?: string;
};

export const AuthGuard = ({ children, fallbackMessage }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <p className="text-sm text-stone-500">Checking permissions...</p>;
  }

  if (!user) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-700">
        {fallbackMessage || "Please login to continue."}{" "}
        <Link href="/login" className="text-orange-600 underline hover:text-orange-700">
          Login
        </Link>
      </div>
    );
  }

  return <>{children}</>;
};
