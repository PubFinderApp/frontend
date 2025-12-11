import { apiFetch } from "@/shared/api/client";
import type { Pub } from "@/entities/pub/model/types";

type FetchPubsParams = {
  sortBy?: "asc" | "desc";
};

export const fetchPubs = (params?: FetchPubsParams) => {
  const query = params?.sortBy ? `?sortBy=${params.sortBy}` : "";
  return apiFetch<Pub[]>(`/pubs${query}`, { cache: "no-store" });
};

export const fetchPubById = (id: number | string) =>
  apiFetch<Pub>(`/pubs/${id}`, { cache: "no-store" });
