"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import AuthGuard from "@/components/AuthGuard";
import PageContainer from "@/components/PageContainer";
import { api } from "@/lib/api";
import { CATEGORIES } from "@/types";

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100";

function LostForm() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState<string>(CATEGORIES[0]);
  const [color, setColor] = useState("");
  const [location, setLocation] = useState("");
  const [dateLost, setDateLost] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [features, setFeatures] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("item_name", itemName.trim());
      fd.append("category", category);
      fd.append("color", color.trim());
      fd.append("location_lost", location.trim());
      fd.append("date_lost", dateLost);
      fd.append("description", description.trim());
      if (brand.trim()) fd.append("brand", brand.trim());
      if (features.trim()) fd.append("features", features.trim());
      if (file) fd.append("image", file);
      const post = await api.createLostPost(fd);
      router.push(`/lost/${post.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Report a lost item</h1>
      <p className="mb-6 text-sm text-gray-600">
        Describe what you lost so others can help you find it.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Item name
          </label>
          <input
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            required
            placeholder="e.g. Water Bottle"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className={inputClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Color
            </label>
            <input
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              placeholder="e.g. Blue"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Last known location
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="e.g. University Library"
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Date lost
          </label>
          <input
            type="date"
            value={dateLost}
            onChange={(e) => setDateLost(e.target.value)}
            required
            className={inputClass}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="e.g. Blue Hydro Flask with anime stickers on the side."
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Brand <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Hydro Flask"
              className={inputClass}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Features <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <input
              value={features}
              onChange={(e) => setFeatures(e.target.value)}
              placeholder="comma, separated"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Reference photo{" "}
            <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-brand file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-brand-dark"
          />
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="mt-3 aspect-video w-full rounded-lg border border-gray-200 object-cover"
            />
          ) : null}
        </div>

        {error ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {submitting ? "Posting…" : "Post lost item"}
        </button>
      </form>
    </div>
  );
}

export default function NewLostPostPage() {
  return (
    <AuthGuard>
      <PageContainer>
        <LostForm />
      </PageContainer>
    </AuthGuard>
  );
}
