import Reveal from "./Reveal";

const FEATURES = [
  {
    icon: "🧠",
    title: "AI Image Recognition",
    body: "Vision AI looks at every uploaded photo and identifies exactly what the item is.",
  },
  {
    icon: "🏷️",
    title: "Automatic Categorization",
    body: "Object, color, brand, and category are tagged automatically — zero manual data entry.",
  },
  {
    icon: "💬",
    title: "Natural Language Search",
    body: "Search the way you'd describe it: “a black backpack with a red zipper.”",
  },
  {
    icon: "🤝",
    title: "Community-Powered",
    body: "Every found item is uploaded by people on your campus who want to help.",
  },
  {
    icon: "⚡",
    title: "Fast Search Experience",
    body: "Instant, structured results — no scrolling through endless social feeds.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="w-full bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <Reveal direction="up">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Everything you need to reunite people with their things
            </h2>
            <p className="mt-3 text-gray-600">
              Powerful AI under the hood, a friendly experience on top.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} direction="up" delay={i * 0.08}>
              <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-2xl">
                  {f.icon}
                </div>
                <h3 className="mb-2 font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
