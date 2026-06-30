"use client";

import Link from "next/link";

import { timeAgo } from "@/lib/format";
import type { FoundItem } from "@/types";

export default function ItemCard({ item }: { item: FoundItem }) {
  return (
    <Link
      href={`/items/${item.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image_url}
          alt={item.object_name ?? "Found item"}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">
            {item.object_name ?? "Unidentified item"}
          </h3>
          {item.category ? (
            <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-brand">
              {item.category}
            </span>
          ) : null}
        </div>
        <p className="text-sm text-gray-600">
          Found by <span className="font-medium">@{item.uploader_username}</span>
        </p>
        <p className="text-sm text-gray-500">📍 {item.location_found}</p>
        <p className="mt-auto pt-1 text-xs text-gray-400">
          🕒 {timeAgo(item.created_at)}
        </p>
      </div>
    </Link>
  );
}
