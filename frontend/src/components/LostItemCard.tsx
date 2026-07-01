"use client";

import Link from "next/link";

import { formatDate } from "@/lib/format";
import type { LostPost } from "@/types";

export default function LostItemCard({ post }: { post: LostPost }) {
  return (
    <Link
      href={`/lost/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {post.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.image_url}
            alt={post.item_name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">
            📷
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-semibold text-gray-900">
            {post.item_name}
          </h3>
          <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-brand">
            {post.category}
          </span>
        </div>
        <p className="text-sm text-gray-600">
          Posted by <span className="font-medium">@{post.owner_username}</span>
        </p>
        <p className="text-sm text-gray-500">📍 {post.location_lost}</p>
        <p className="mt-auto pt-1 text-xs text-gray-400">
          📅 {formatDate(post.date_lost)}
        </p>
      </div>
    </Link>
  );
}
