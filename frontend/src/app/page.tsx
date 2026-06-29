"use client";

import { useCallback, useEffect, useState } from "react";

import CategoryChips from "@/components/CategoryChips";
import ItemGrid from "@/components/ItemGrid";
import SearchBar from "@/components/SearchBar";
import { api } from "@/lib/api";
import type { ExtractedFilters, FoundItem } from "@/types";

function errorMessage(e: unknown): string {
  return e instanceof Error ? e.message : "Something went wrong";
}

export default function HomePage() {
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [extracted, setExtracted] = useState<ExtractedFilters | null>(null);
  const [lastQuery, setLastQuery] = useState<string | null>(null);

  const browse = useCallback(async (cat: string | null) => {
    setLoading(true);
    setError(null);
    setExtracted(null);
    setLastQuery(null);
    try {
      const data = await api.listItems(cat ? { category: cat } : {});
      setItems(data.items);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    browse(category);
  }, [category, browse]);

  const handleSearch = async (query: string) => {
    setSearching(true);
    setError(null);
    try {
      const data = await api.search({
        query,
        category: category ?? undefined,
      });
      setItems(data.results);
      setExtracted(data.extracted);
      setLastQuery(query);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSearching(false);
    }
  };

  const handleClear = () => browse(category);

  const extractedTags = extracted
    ? (["object", "color", "location", "category"] as const)
        .map((k) => ({ k, v: extracted[k] }))
        .filter((t) => t.v)
    : [];

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Found Items</h1>
        <p className="text-gray-600">
          Lost something? Search or browse the items people have found. Try
          natural language — our AI figures out what you mean.
        </p>
      </section>

      <SearchBar
        onSearch={handleSearch}
        onClear={handleClear}
        loading={searching}
      />

      <CategoryChips active={category} onSelect={setCategory} />

      {extracted && lastQuery ? (
        <div className="rounded-lg border border-indigo-100 bg-indigo-50 p-3 text-sm">
          <span className="font-medium text-brand">AI understood: </span>
          {extractedTags.length ? (
            <span className="inline-flex flex-wrap gap-1.5 align-middle">
              {extractedTags.map((t) => (
                <span
                  key={t.k}
                  className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-indigo-100"
                >
                  {t.k}: {t.v}
                </span>
              ))}
            </span>
          ) : (
            <span className="text-gray-600">keyword match on “{lastQuery}”</span>
          )}
          <span className="ml-2 text-gray-500">· {items.length} result(s)</span>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {loading ? (
        <div className="py-16 text-center text-gray-500">Loading items…</div>
      ) : (
        <ItemGrid
          items={items}
          emptyMessage={
            lastQuery
              ? "No matches found. Try a different search."
              : "No found items yet. Be the first to upload one!"
          }
        />
      )}
    </div>
  );
}
