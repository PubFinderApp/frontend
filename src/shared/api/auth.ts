import { apiFetch } from "@/shared/api/client";
import { clearAuthSession } from "@/shared/lib/auth-storage";

export type AuthResponse = {
  token: string;
  accountId: number;
  username: string;
};

export type SignupPayload = {
  username: string;
  password: string;
  name: string;
  surname: string;
  email: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};

export const signup = (payload: SignupPayload) =>
  apiFetch<AuthResponse>("/auth/register", { method: "POST", data: payload });

export const login = (payload: LoginPayload) =>
  apiFetch<AuthResponse>("/auth/login", { method: "POST", data: payload });

export const logout = async () => {
  clearAuthSession();
  return { success: true };
};
