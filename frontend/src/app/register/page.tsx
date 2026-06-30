"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import PageContainer from "@/components/PageContainer";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await api.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      login(res.access_token, res.user);
      router.push("/browse");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
    <div className="mx-auto max-w-sm">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength={3}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-blue-100"
          />
          <p className="mt-1 text-xs text-gray-500">At least 6 characters.</p>
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
          {submitting ? "Creating account…" : "Register"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">
          Log in
        </Link>
      </p>
    </div>
    </PageContainer>
  );
}
