import Reveal from "./Reveal";

const PROBLEMS = [
  {
    icon: "😟",
    title: "Lost items are hard to recover",
    body: "Once something goes missing on a busy campus, the odds of finding it again are slim — there's no central place to look.",
  },
  {
    icon: "🗂️",
    title: "Traditional systems are disorganized",
    body: "Cardboard boxes at the front desk and scattered spreadsheets make it nearly impossible to match items to owners.",
  },
  {
    icon: "📱",
    title: "Searching social media is inefficient",
    body: "Endless 'found this — anyone?' posts get buried in feeds. There's no search, no structure, and no follow-up.",
  },
];

export default function ProblemSection() {
  return (
    <section className="w-full bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <Reveal direction="up">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Losing something shouldn&apos;t mean losing it forever
            </h2>
            <p className="mt-3 text-gray-600">
              The old way of handling lost &amp; found is slow, scattered, and
              frustrating for everyone involved.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <Reveal key={p.title} direction="up" delay={i * 0.08}>
              <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
                  {p.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{p.title}</h3>
                <p className="text-sm text-gray-600">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
