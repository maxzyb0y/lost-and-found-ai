import Reveal from "./Reveal";

const STEPS = [
  {
    icon: "📸",
    title: "Upload a photo",
    body: "Someone finds an item and snaps a quick photo — that's the only effort required.",
  },
  {
    icon: "🤖",
    title: "AI analyzes it",
    body: "Our AI identifies the object, color, brand, and category automatically — no manual tagging.",
  },
  {
    icon: "🔎",
    title: "Search or browse",
    body: "People who lost something search in plain language or browse by category to find a match.",
  },
  {
    icon: "🎉",
    title: "Reunited",
    body: "The owner spots their item and gets it back — faster than any noticeboard ever could.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <Reveal direction="up">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              How Only Found works
            </h2>
            <p className="mt-3 text-gray-600">
              Four simple steps from found to returned.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} direction="up" delay={i * 0.1}>
              <div className="relative text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                  {s.icon}
                </div>
                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1 rounded-full bg-brand px-2 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mb-2 font-semibold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
