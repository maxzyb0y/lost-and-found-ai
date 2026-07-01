"use client";

import Link from "next/link";
import { useState } from "react";

import AiMetadata from "@/components/AiMetadata";
import AuthGuard from "@/components/AuthGuard";
import PageContainer from "@/components/PageContainer";
import { api } from "@/lib/api";
import type { FoundItem } from "@/types";

function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<FoundItem | null>(null);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please choose a photo of the found item.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("image", file);
      fd.append("location_found", location.trim());
      if (notes.trim()) fd.append("notes", notes.trim());
      const item = await api.uploadItem(fd);
      setResult(item);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="mx-auto max-w-lg space-y-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
          ✅ Item uploaded and analyzed!
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={result.image_url}
          alt={result.object_name ?? "Uploaded item"}
          className="aspect-video w-full rounded-xl object-cover"
        />
        <AiMetadata item={result} />
        <div className="flex gap-2">
          <Link
            href={`/items/${result.id}`}
            className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            View item
          </Link>
          <button
            onClick={() => {
              setResult(null);
              setFile(null);
              setPreview(null);
              setLocation("");
              setNotes("");
            }}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Upload another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <Link
        href="/browse"
        className="mb-4 inline-block text-sm font-medium text-brand hover:underline"
      >
        ← Back to found items
      </Link>
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Upload a found item</h1>
      <p className="mb-6 text-sm text-gray-600">
        Add a photo and where you found it — our AI will tag the rest.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Item photo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onFileChange}
            required
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

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Location found
          </label>
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="e.g. Library, 2nd floor"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Notes <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Anything helpful for the owner to identify it."
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          />
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
          {submitting ? "Analyzing with AI…" : "Upload & analyze"}
        </button>
      </form>
    </div>
  );
}

export default function UploadPage() {
  return (
    <AuthGuard>
      <PageContainer>
        <UploadForm />
      </PageContainer>
    </AuthGuard>
  );
}
