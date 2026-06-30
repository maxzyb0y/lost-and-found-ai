import type { Metadata } from "next";
import type { ReactNode } from "react";

import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

export const metadata: Metadata = {
  title: "Only Found — Only found. Never forgotten.",
  description:
    "AI-powered lost & found for modern campuses. Upload found items and let AI identify them, or search in plain language to recover what you lost.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
