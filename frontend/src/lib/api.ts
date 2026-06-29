import {
  AuthResponse,
  FoundItem,
  FoundItemList,
  SearchResponse,
  User,
} from "@/types";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const TOKEN_KEY = "lf_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window !== "undefined") localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  if (typeof window !== "undefined") localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail: string = res.statusText;
    try {
      const body = await res.json();
      if (typeof body?.detail === "string") detail = body.detail;
      else if (Array.isArray(body?.detail) && body.detail[0]?.msg)
        detail = body.detail[0].msg;
    } catch {
      /* response had no JSON body */
    }
    throw new ApiError(detail, res.status);
  }
  return (await res.json()) as T;
}

export const api = {
  register(body: { username: string; email: string; password: string }) {
    return fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<AuthResponse>(r));
  },

  login(body: { username_or_email: string; password: string }) {
    return fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<AuthResponse>(r));
  },

  me() {
    return fetch(`${API_URL}/auth/me`, { headers: authHeaders() }).then((r) =>
      handle<User>(r)
    );
  },

  listItems(params: {
    category?: string;
    q?: string;
    uploader?: string;
    limit?: number;
    offset?: number;
  } = {}) {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
    });
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetch(`${API_URL}/found-items${suffix}`).then((r) =>
      handle<FoundItemList>(r)
    );
  },

  getItem(id: number | string) {
    return fetch(`${API_URL}/found-items/${id}`).then((r) =>
      handle<FoundItem>(r)
    );
  },

  uploadItem(formData: FormData) {
    return fetch(`${API_URL}/found-items`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    }).then((r) => handle<FoundItem>(r));
  },

  search(body: { query: string; category?: string }) {
    return fetch(`${API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => handle<SearchResponse>(r));
  },
};
