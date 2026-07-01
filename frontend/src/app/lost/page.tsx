"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import CategoryChips from "@/components/CategoryChips";
import LostItemCard from "@/components/LostItemCard";
import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import type { LostPost } from "@/types";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong";
}

export default function LostPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<LostPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);

  const browse = useCallback(async (cat: string | null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listLostPosts(cat ? { category: cat } : {});
      setPosts(data.items);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    browse(category);
  }, [category, browse]);

  return (
    <PageContainer>
      <div className="space-y-6">
        <section className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">Lost Items</h1>
            <p className="text-gray-600">
              Items people are looking for. Spotted one? Check the Found Items
              catalog or reach out to the owner.
            </p>
          </div>
          {user ? (
            <Link
              href="/lost/new"
              className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
            >
              + Report lost item
            </Link>
          ) : null}
        </section>

        <CategoryChips active={category} onSelect={setCategory} />

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="py-16 text-center text-gray-500">Loading items…</div>
        ) : posts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center text-gray-500">
            No lost items posted yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {posts.map((post) => (
              <LostItemCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
