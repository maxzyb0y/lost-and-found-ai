"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { LostPost } from "@/types";

export default function LostPostDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { user } = useAuth();
  const router = useRouter();
  const [post, setPost] = useState<LostPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getLostPost(params.id)
      .then((data) => {
        if (active) setPost(data);
      })
      .catch((e) => {
        if (active)
          setError(
            e instanceof ApiError && e.status === 404
              ? "This post doesn't exist (or was removed)."
              : "Couldn't load this post."
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
    if (!post || !confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    try {
      await api.deleteLostPost(post.id);
      router.push("/lost");
    } catch {
      setDeleting(false);
      alert("Failed to delete post.");
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="py-16 text-center text-gray-500">Loading…</div>
      </PageContainer>
    );
  }

  if (error || !post) {
    return (
      <PageContainer>
        <div className="mx-auto max-w-md space-y-4 py-12 text-center">
          <p className="text-gray-700">{error ?? "Post not found."}</p>
          <Link href="/lost" className="font-medium text-brand hover:underline">
            ← Back to lost items
          </Link>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/lost" className="text-sm font-medium text-brand hover:underline">
            ← Back to lost items
          </Link>
          {user?.is_admin && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete post"}
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {post.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.image_url}
                alt={post.item_name}
                className="w-full object-cover"
              />
            ) : (
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-gray-100 text-6xl text-gray-300">
                📷
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  {post.item_name}
                </h1>
                <span className="shrink-0 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-brand">
                  {post.category}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Posted by{" "}
                <span className="font-medium">@{post.owner_username}</span>
              </p>
            </div>

            <div className="space-y-1 text-sm text-gray-700">
              <p>
                🎨 Color <span className="font-medium">{post.color}</span>
              </p>
              <p>
                📍 Last seen at{" "}
                <span className="font-medium">{post.location_lost}</span>
              </p>
              <p>📅 Lost on {formatDate(post.date_lost)}</p>
              {post.brand ? (
                <p>
                  🏷️ Brand <span className="font-medium">{post.brand}</span>
                </p>
              ) : null}
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-3 text-sm">
              <p className="mb-1 font-medium text-gray-500">Description</p>
              <p className="text-gray-900">{post.description}</p>
            </div>

            {post.features.length > 0 ? (
              <div>
                <p className="mb-1 text-sm font-medium text-gray-500">Features</p>
                <ul className="flex flex-wrap gap-1.5">
                  {post.features.map((f, i) => (
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
        </div>
      </div>
    </PageContainer>
  );
}
