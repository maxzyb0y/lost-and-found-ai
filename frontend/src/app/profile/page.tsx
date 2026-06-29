"use client";

import { useEffect, useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import ItemGrid from "@/components/ItemGrid";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { FoundItem } from "@/types";

function Profile() {
  const { user } = useAuth();
  const [items, setItems] = useState<FoundItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api
      .listItems({ uploader: user.username, limit: 100 })
      .then((data) => setItems(data.items))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-gray-200 bg-white p-5">
        <h1 className="text-2xl font-bold text-gray-900">@{user.username}</h1>
        <p className="text-sm text-gray-600">{user.email}</p>
        <p className="mt-1 text-xs text-gray-400">
          Member since {formatDate(user.created_at)}
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          Your uploaded items{" "}
          <span className="text-sm font-normal text-gray-500">
            ({items.length})
          </span>
        </h2>
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading…</div>
        ) : (
          <ItemGrid
            items={items}
            emptyMessage="You haven’t uploaded any found items yet."
          />
        )}
      </section>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  );
}
