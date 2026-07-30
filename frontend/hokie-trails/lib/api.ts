import type {
  AuthResponse,
  Housing,
  Trail,
  User,
} from "./types";

// When NEXT_PUBLIC_API_URL is set, call that absolute URL (e.g. a public API
// gateway). Otherwise use same-origin relative paths and let the Next.js server
// proxy /api/* to the backend (see next.config.ts rewrites). Same-origin avoids
// CORS and works behind a single forwarded port.
const API_URL = process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")
  : "";

const TOKEN_KEY = "hokie_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_KEY, token);
  else window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;
  constructor(message: string, status: number, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const text = await res.text();
  const data = text ? JSON.parse(text) : {};

  if (!res.ok) {
    throw new ApiError(
      data.error || `Request failed with status ${res.status}`,
      res.status,
      data.fields,
    );
  }
  return data as T;
}

// ---------------------------------------------------------------- Trails
export interface TrailFilters {
  q?: string;
  difficulty?: string;
  town?: string;
  min_rating?: number;
  max_length?: number;
  sort?: string;
  limit?: number;
}

function toQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });
  const str = search.toString();
  return str ? `?${str}` : "";
}

export const api = {
  // Trails
  listTrails: (filters: TrailFilters = {}) =>
    request<{ count: number; trails: Trail[] }>(
      `/api/trails/${toQuery(filters as Record<string, unknown>)}`,
    ),
  getTrail: (id: string) => request<{ trail: Trail }>(`/api/trails/${id}`),
  listTowns: () => request<{ towns: string[] }>(`/api/trails/towns`),

  // Housing
  listHousing: (filters: Record<string, unknown> = {}) =>
    request<{ count: number; housing: Housing[] }>(`/api/housing/${toQuery(filters)}`),
  getHousing: (id: string) => request<{ housing: Housing }>(`/api/housing/${id}`),
  housingNearTrail: (trailId: string) =>
    request<{ count: number; housing: Housing[] }>(`/api/housing/near/${trailId}`),

  // Auth
  register: (body: { username: string; email: string; password: string }) =>
    request<AuthResponse>(`/api/auth/register`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  login: (body: { email: string; password: string }) =>
    request<AuthResponse>(`/api/auth/login`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  me: () => request<{ user: User }>(`/api/auth/me`),

  // Saved bookmarks
  saveTrail: (id: string) =>
    request<{ saved_trails: string[] }>(`/api/auth/saved/trails/${id}`, { method: "POST" }),
  unsaveTrail: (id: string) =>
    request<{ saved_trails: string[] }>(`/api/auth/saved/trails/${id}`, { method: "DELETE" }),
  saveHousing: (id: string) =>
    request<{ saved_housing: string[] }>(`/api/auth/saved/housing/${id}`, { method: "POST" }),
  unsaveHousing: (id: string) =>
    request<{ saved_housing: string[] }>(`/api/auth/saved/housing/${id}`, { method: "DELETE" }),
};

export { API_URL };
