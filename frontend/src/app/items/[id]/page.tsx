"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AiMetadata from "@/components/AiMetadata";
import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { FoundItem } from "@/types";

export default function ItemDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [item, setItem] = useState<FoundItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getItem(params.id)
      .then((data) => {
        if (active) setItem(data);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof ApiError && e.status === 404
              ? "This item doesn’t exist (or was removed)."
              : "Couldn’t load this item."
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [params.id]);

  async function handleDelete() {
    if (!item || !confirm("Delete this item? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.deleteItem(item.id);
      router.push("/browse");
    } catch {
      setDeleting(false);
      alert("Failed to delete item.");
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-gray-500">Loading…</div>
      </PageContainer>
    );
  }

  if (error || !item) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-md space-y-4 py-12 text-center">
          <p className="text-gray-700">{error ?? "Item not found."}</p>
          <Link href="/browse" className="font-medium text-brand hover:underline">
            ← Back to all items
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/browse" className="text-sm font-medium text-brand hover:underline">
          ← Back to all items
        </Link>
        {user?.is_admin && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete item"}
          </button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image_url}
            alt={item.object_name ?? "Found item"}
            className="w-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {item.object_name ?? "Unidentified item"}
            </h1>
            <p className="text-sm text-gray-600">
              Found by{" "}
              <span className="font-medium">@{item.uploader_username}</span>
            </p>
          </div>

          <div className="space-y-1 text-sm text-gray-700">
            <p>📍 Found at <span className="font-medium">{item.location_found}</span></p>
            <p>🗓️ Uploaded on {formatDate(item.created_at)}</p>
          </div>

          {item.notes ? (
            <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
              <p className="mb-1 font-medium text-gray-500">Notes</p>
              <p className="text-gray-900">{item.notes}</p>
            </div>
          ) : null}

          <AiMetadata item={item} />
        </div>
      </div>
    </div>
    </PageContainer>
  );
}
