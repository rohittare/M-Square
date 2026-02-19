"use client";

export type UserRole = "USER" | "SHOP" | "ADMIN";

const STORAGE_KEYS = [
  "access_token",
  "token_type",
  "user_id",
  "user_email",
  "user_role",
  "shop_id",
] as const;

type JwtPayload = {
  exp?: number;
  role?: string;
  roles?: string[] | string;
  authorities?: string[] | string;
};

const normalizeRole = (raw: string | null | undefined): UserRole | null => {
  if (!raw) return null;
  const cleaned = raw.toUpperCase().replace(/^ROLE_/, "");
  if (cleaned === "OWNER") return "SHOP";
  if (cleaned === "SHOP" || cleaned === "USER" || cleaned === "ADMIN") {
    return cleaned;
  }
  return null;
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    return null;
  }
};

const getRoleFromPayload = (payload: JwtPayload | null): UserRole | null => {
  if (!payload) return null;
  const directRole = normalizeRole(payload.role);
  if (directRole) return directRole;

  const rolesList =
    Array.isArray(payload.roles) ? payload.roles : payload.roles ? [payload.roles] : [];
  const authoritiesList =
    Array.isArray(payload.authorities)
      ? payload.authorities
      : payload.authorities
      ? [payload.authorities]
      : [];

  for (const entry of [...rolesList, ...authoritiesList]) {
    const normalized = normalizeRole(entry);
    if (normalized) return normalized;
  }

  return null;
};

export const clearAuthStorage = () => {
  if (typeof window === "undefined") return;
  STORAGE_KEYS.forEach((key) => sessionStorage.removeItem(key));
};

export const getAuthSnapshot = () => {
  if (typeof window === "undefined") {
    return { isAuthenticated: false, role: null as UserRole | null };
  }

  const token = sessionStorage.getItem("access_token");
  if (!token) {
    return { isAuthenticated: false, role: null as UserRole | null };
  }

  const payload = parseJwtPayload(token);
  if (payload?.exp && payload.exp * 1000 < Date.now()) {
    clearAuthStorage();
    return { isAuthenticated: false, role: null as UserRole | null };
  }

  const storedRole = normalizeRole(sessionStorage.getItem("user_role"));
  const payloadRole = getRoleFromPayload(payload);
  const role = payloadRole ?? storedRole;

  if (role && role !== storedRole) {
    sessionStorage.setItem("user_role", role);
  }

  return { isAuthenticated: true, role };
};
