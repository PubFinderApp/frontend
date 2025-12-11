import { apiFetch } from "@/shared/api/client";
import type { Review } from "@/entities/review/model/types";

// Fetch reviews by pub - include auth if available
export const fetchReviewsByPub = (pubId: number | string) =>
  apiFetch(`/reviews/pub/${pubId}`, {
    cache: "no-store",
    withAuth: "optional", // Include token if available, but don't require it
  });

// Fetch reviews by user - include auth if available
export const fetchReviewsByUser = (userId: number | string) =>
  apiFetch(`/reviews/user/${userId}`, {
    cache: "no-store",
    withAuth: "optional", // Include token if available, but don't require it
  });

type ReviewPayload = {
  pubId: number;
  content: string;
  rate: number;
};

export const createReviewRequest = (data: ReviewPayload) =>
  apiFetch("/reviews", {
    method: "POST",
    data,
    withAuth: true,
  });

export const updateReviewRequest = (
  reviewId: number | string,
  data: ReviewPayload
) =>
  apiFetch(`/reviews/${reviewId}`, {
    method: "PUT",
    data,
    withAuth: true,
  });

export const deleteReviewRequest = (reviewId: number | string) =>
  apiFetch(`/reviews/${reviewId}`, {
    method: "DELETE",
    withAuth: true,
  });

export const likeReviewRequest = (reviewId: number | string) =>
  apiFetch(`/reviews/${reviewId}/like`, {
    method: "POST",
    withAuth: true,
  });

export const unlikeReviewRequest = (reviewId: number | string) =>
  apiFetch(`/reviews/${reviewId}/like`, {
    method: "DELETE",
    withAuth: true,
  });