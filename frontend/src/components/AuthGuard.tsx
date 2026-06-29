"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import type { ReactNode } from "react";

import { useAuth } from "@/context/AuthContext";

/** Wraps a protected page: redirects guests to /login once auth state is known. */
export default function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">Loading…</div>
    );
  }
  if (!user) return null;

  return <>{children}</>;
}
