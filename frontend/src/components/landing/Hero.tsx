import Link from "next/link";

import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section className="w-full bg-gradient-to-b from-blue-50 to-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-20 md:grid-cols-2 md:py-28">
        {/* Copy */}
        <div className="space-y-6">
          <Reveal direction="up">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-3 py-1 text-xs font-medium text-brand shadow-sm">
              <span aria-hidden>✨</span> AI-powered lost &amp; found
            </span>
          </Reveal>
          <Reveal direction="up" delay={0.08}>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-5xl">
              AI-Powered Lost &amp; Found for{" "}
              <span className="text-brand">Modern Schools</span>
            </h1>
          </Reveal>
          <Reveal direction="up" delay={0.16}>
            <p className="max-w-md text-lg text-gray-600">
              Only found. Never forgotten. Upload a found item and our AI
              identifies it instantly — so the people who lost it can search in
              plain language and get it back faster.
            </p>
          </Reveal>
          <Reveal direction="up" delay={0.24}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="w-full rounded-lg bg-brand px-6 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-brand-dark sm:w-auto"
              >
                Get Started
              </Link>
              <Link
                href="/browse"
                className="w-full rounded-lg border border-brand px-6 py-3 text-center text-sm font-semibold text-brand transition hover:bg-blue-50 sm:w-auto"
              >
                Browse Found Items
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Dashboard mockup */}
        <Reveal direction="right" delay={0.2}>
          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-400">
              🔎 “blue water bottle near the library”
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { emoji: "🧴", name: "Water Bottle", loc: "Library", user: "maya" },
                { emoji: "🎒", name: "Backpack", loc: "Cafeteria", user: "leo" },
                { emoji: "🔑", name: "Keys", loc: "Parking Lot", user: "sara" },
                { emoji: "📱", name: "Smartphone", loc: "Gym", user: "noah" },
              ].map((m) => (
                <div
                  key={m.name}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <div className="flex h-20 items-center justify-center bg-blue-50 text-3xl">
                    {m.emoji}
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-semibold text-gray-900">{m.name}</p>
                    <p className="text-[10px] text-gray-500">📍 {m.loc}</p>
                    <p className="text-[10px] text-gray-400">@{m.user}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
