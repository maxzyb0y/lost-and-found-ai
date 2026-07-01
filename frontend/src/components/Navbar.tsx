"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // On Lost Items pages the two primary buttons flip to their "lost" context.
  const onLost = pathname?.startsWith("/lost") ?? false;
  const primary = onLost
    ? { href: "/lost/new", label: "Report lost item" }
    : { href: "/upload", label: "Upload Item" };
  const toggle = onLost
    ? { href: "/browse", label: "Found Items" }
    : { href: "/lost", label: "Lost Items" };

  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href={user ? "/browse" : "/"} className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <span aria-hidden>🔎</span>
          Only <span className="text-brand">Found</span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {loading ? null : user ? (
            <>
              <Link
                href={primary.href}
                className="rounded-md bg-brand px-3 py-1.5 font-medium text-white hover:bg-brand-dark"
              >
                {primary.label}
              </Link>
              <Link
                href={toggle.href}
                className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                {toggle.label}
              </Link>
              <Link
                href="/profile"
                className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href={toggle.href}
                className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                {toggle.label}
              </Link>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-brand px-3 py-1.5 font-medium text-white hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
