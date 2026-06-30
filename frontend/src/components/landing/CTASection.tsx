import Link from "next/link";

import Reveal from "./Reveal";

export default function CTASection() {
  return (
    <section className="w-full bg-brand">
      <div className="mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
        <Reveal direction="up">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to find what matters?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Join Only Found and help your campus reunite people with the things
            they&apos;ve lost. Only found. Never forgotten.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/register"
              className="w-full rounded-lg bg-white px-6 py-3 text-center text-sm font-semibold text-brand shadow-sm transition hover:bg-blue-50 sm:w-auto"
            >
              Register
            </Link>
            <Link
              href="/browse"
              className="w-full rounded-lg border border-white/70 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
            >
              Browse Items
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
