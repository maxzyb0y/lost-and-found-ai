import Image from "next/image";
import Link from "next/link";

const LINKS = [
  { href: "/browse", label: "Browse" },
  { href: "/upload", label: "Upload" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 md:flex-row md:items-center md:justify-between">
        <div>
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-gray-900"
          >
            <Image
              src="/logo.png"
              alt="Only Found logo"
              width={32}
              height={36}
              className="h-8 w-auto"
            />
            Only <span className="text-brand">Found</span>
          </Link>
          <p className="mt-2 text-sm text-gray-500">
            Only found. Never forgotten.
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-brand"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-gray-100 py-4">
        <p className="text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Only Found. Only found. Never forgotten.
        </p>
      </div>
    </footer>
  );
}
