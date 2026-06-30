import Reveal from "./Reveal";

const CATEGORIES = ["All", "Electronics", "Bags", "Keys", "Bottles", "Clothing"];

const MOCK_ITEMS = [
  { emoji: "💧", name: "Water Bottle", cat: "Bottles", loc: "Library", user: "maya" },
  { emoji: "🎒", name: "Backpack", cat: "Bags", loc: "Cafeteria", user: "leo" },
  { emoji: "📱", name: "Smartphone", cat: "Electronics", loc: "Gym", user: "noah" },
  { emoji: "🔑", name: "Keys", cat: "Keys", loc: "Parking Lot", user: "sara" },
  { emoji: "🧥", name: "Jacket", cat: "Clothing", loc: "Bus Stop", user: "amir" },
  { emoji: "📓", name: "Notebook", cat: "Stationery", loc: "Lecture Hall B", user: "kim" },
];

export default function DashboardPreview() {
  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 md:py-28">
        <Reveal direction="up">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              A clean, searchable catalog of found items
            </h2>
            <p className="mt-3 text-gray-600">
              This is what browsing on Only Found looks like.
            </p>
          </div>
        </Reveal>

        <Reveal direction="up" delay={0.1}>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5 shadow-sm md:p-8">
            {/* faux search bar */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <div className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-400">
                Try: "I lost a blue water bottle near the library"
              </div>
              <div className="rounded-lg bg-brand px-5 py-2.5 text-center text-sm font-medium text-white">
                Search
              </div>
            </div>

            {/* category chips */}
            <div className="mb-6 flex flex-wrap gap-2">
              {CATEGORIES.map((c, i) => (
                <span
                  key={c}
                  className={`rounded-full border px-3 py-1.5 text-sm ${
                    i === 0
                      ? "border-brand bg-brand text-white"
                      : "border-gray-300 bg-white text-gray-700"
                  }`}
                >
                  {c}
                </span>
              ))}
            </div>

            {/* item grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {MOCK_ITEMS.map((m) => (
                <div
                  key={m.name}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-100 text-6xl">
                    {m.emoji}
                  </div>
                  <div className="space-y-1 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-gray-900">{m.name}</h3>
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-brand">
                        {m.cat}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Found by <span className="font-medium">@{m.user}</span>
                    </p>
                    <p className="text-sm text-gray-500">📍 {m.loc}</p>
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
