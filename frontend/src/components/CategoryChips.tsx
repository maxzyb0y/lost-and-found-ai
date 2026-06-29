"use client";

import { CATEGORIES } from "@/types";

export default function CategoryChips({
  active,
  onSelect,
}: {
  active: string | null;
  onSelect: (category: string | null) => void;
}) {
  const base =
    "rounded-full border px-3 py-1.5 text-sm font-medium transition";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect(null)}
        className={`${base} ${
          active === null
            ? "border-brand bg-brand text-white"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
        }`}
      >
        All
      </button>
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          className={`${base} ${
            active === cat
              ? "border-brand bg-brand text-white"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
