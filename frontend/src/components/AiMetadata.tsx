"use client";

import type { FoundItem } from "@/types";

function Row({ label, value }: { label: string; value: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-28 shrink-0 font-medium text-gray-500">{label}</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

export default function AiMetadata({ item }: { item: FoundItem }) {
  const confidence =
    item.confidence_score !== null
      ? Math.round(Number(item.confidence_score))
      : null;

  return (
    <div className="space-y-3 rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">🤖 AI Analysis</h3>
        {confidence !== null ? (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            {confidence}% confidence
          </span>
        ) : null}
      </div>

      <div className="space-y-1.5">
        <Row label="Object" value={item.object_name} />
        <Row label="Category" value={item.category} />
        <Row label="Color" value={item.color} />
        <Row label="Brand" value={item.brand} />
      </div>

      {item.features.length > 0 ? (
        <div>
          <p className="mb-1 text-sm font-medium text-gray-500">Features</p>
          <ul className="flex flex-wrap gap-1.5">
            {item.features.map((f, i) => (
              <li
                key={i}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-700"
              >
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
