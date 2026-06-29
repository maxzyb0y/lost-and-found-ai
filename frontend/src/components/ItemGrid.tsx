"use client";

import ItemCard from "@/components/ItemCard";
import type { FoundItem } from "@/types";

export default function ItemGrid({
  items,
  emptyMessage = "No items to show yet.",
}: {
  items: FoundItem[];
  emptyMessage?: string;
}) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
