import type { ReactNode } from "react";

/**
 * Standard width-constrained page wrapper. The root layout no longer constrains
 * width (so the landing page can use full-bleed sections), so every non-landing
 * page wraps its content in this to keep the previous look.
 */
export default function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>;
}
