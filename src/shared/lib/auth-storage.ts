import { Buffer } from "buffer";
import type { User } from "@/entities/user/model/types";

const STORAGE_KEY = "pubfinder.auth";

const isBrowser = () => typeof window !== "undefined" && !!window.localStorage;

const decodeBase64 = (value: string) => {
  if (typeof window === "undefined") {
    return Buffer.from(value, "base64").toString("utf-8");
  }
  return window.atob(value);
};

const getTokenExpiry = (token: string): number | null => {
  try {
    const [, payload = ""] = token.split(".");
    if (!payload) {
      return null;
    }
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = decodeBase64(normalized);
    const parsed = JSON.parse(decoded) as { exp?: number };
    if (!parsed.exp) {
      return null;
    }
    return parsed.exp * 1000;
  } catch (error) {
    console.warn("Failed to decode auth token", error);
    return null;
  }
};

const withTokenExpiry = <T extends User>(session: T): T => {
  if (session.tokenExpiresAt) {
    return session;
  }

  const tokenExpiresAt = getTokenExpiry(session.token);
  return {
    ...session,
    tokenExpiresAt,
  };
};

const isSessionExpired = (session: User | null) => {
  if (!session?.token) {
    return true;
  }

  const expiresAt = session.tokenExpiresAt ?? getTokenExpiry(session.token);
  if (!expiresAt) {
    return false;
  }

  return Date.now() >= expiresAt;
};

export const saveAuthSession = (session: User) => {
  if (!isBrowser()) return session;
  const normalized = withTokenExpiry(session);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
  return normalized;
};

export const getStoredAuthSession = (): User | null => {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const session = withTokenExpiry(JSON.parse(raw) as User);
    if (isSessionExpired(session)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch (error) {
    console.error("Failed to parse stored auth session", error);
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
};

export const clearAuthSession = () => {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
};

export const getAuthToken = () => getStoredAuthSession()?.token ?? null;
