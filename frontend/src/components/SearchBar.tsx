"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
  onClear,
  loading = false,
}: {
  onSearch: (query: string) => void;
  onClear: () => void;
  loading?: boolean;
}) {
  const [value, setValue] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) onSearch(q);
  };

  const clear = () => {
    setValue("");
    onClear();
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-2 sm:flex-row">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder='Try: "I lost a blue water bottle near the library"'
        className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-indigo-100"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
        >
          {loading ? "Searching…" : "Search"}
        </button>
        {value ? (
          <button
            type="button"
            onClick={clear}
            className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
          >
            Clear
          </button>
        ) : null}
      </div>
    </form>
  );
}
