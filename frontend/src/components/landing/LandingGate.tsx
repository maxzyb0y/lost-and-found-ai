"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";

import { getToken } from "@/lib/api";

/**
 * The landing page is for visitors only. If a logged-in user (one with a stored
 * token) lands on `/`, send them straight to the browse dashboard instead.
 * Guests render the marketing page with no flash.
 */
export default function LandingGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (getToken()) {
      setRedirecting(true);
      router.replace("/browse");
    }
  }, [router]);

  if (redirecting) return null;
  return <>{children}</>;
}
