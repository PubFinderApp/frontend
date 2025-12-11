"use client";

import { useCallback, useEffect, useState } from "react";
import type { Review } from "@/entities/review/model/types";
import {
  createReviewRequest,
  deleteReviewRequest,
  fetchReviewsByPub,
  likeReviewRequest,
  unlikeReviewRequest,
  updateReviewRequest,
} from "@/shared/api/reviews";
import { ApiError } from "@/shared/api/client";
import { useAuth } from "@/features/auth/model/useAuth";
import {
  getStoredReviewLikes,
  setStoredReviewLike,
} from "@/shared/lib/review-likes-storage";

export type ReviewFormValues = {
  rate: number;
  content: string;
};

export const useReviews = (pubId: number) => {
  const { user } = useAuth();
  const userId = user?.accountId ?? null;
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMutating, setIsMutating] = useState(false);
  const [pendingLikeIds, setPendingLikeIds] = useState<Set<number>>(new Set());

  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchReviewsByPub(pubId);
      const storedLikes = getStoredReviewLikes(userId);
      setReviews(
        response.map((review) => {
          const stored = storedLikes[review.id];
          const liked = review.likedByCurrentUser ?? stored ?? false;
          if (userId) {
            setStoredReviewLike(userId, review.id, liked);
          }
          return {
            ...review,
            likedByCurrentUser: liked,
          };
        })
      );
      if (response.length === 0) {
        setAverageRating(null);
      } else {
        const avg =
          response.reduce((sum, review) => sum + review.rate, 0) /
          response.length;
        setAverageRating(Number(avg.toFixed(1)));
      }
      setError(null);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, [pubId, userId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const createReview = useCallback(
    async (values: ReviewFormValues) => {
      setIsMutating(true);
      try {
        await createReviewRequest({
          pubId,
          rate: values.rate,
          content: values.content,
        });
        await loadReviews();
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [pubId, loadReviews]
  );

  const updateReview = useCallback(
    async (reviewId: number, values: ReviewFormValues) => {
      setIsMutating(true);
      try {
        await updateReviewRequest(reviewId, {
          pubId,
          rate: values.rate,
          content: values.content,
        });
        await loadReviews();
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [pubId, loadReviews]
  );

  const deleteReview = useCallback(
    async (reviewId: number) => {
      setIsMutating(true);
      try {
        await deleteReviewRequest(reviewId);
        await loadReviews();
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        throw err;
      } finally {
        setIsMutating(false);
      }
    },
    [loadReviews]
  );

  const setLikePending = useCallback((reviewId: number, pending: boolean) => {
    setPendingLikeIds((prev) => {
      const next = new Set(prev);
      if (pending) {
        next.add(reviewId);
      } else {
        next.delete(reviewId);
      }
      return next;
    });
  }, []);

  const updateReviewLikeLocally = useCallback(
    (reviewId: number, delta: number, liked: boolean) => {
      setReviews((prev) =>
        prev.map((review) =>
          review.id === reviewId
            ? {
                ...review,
                likeCount: Math.max(0, review.likeCount + delta),
                likedByCurrentUser: liked,
              }
            : review
        )
      );
      if (userId) {
        setStoredReviewLike(userId, reviewId, liked);
      }
    },
    [userId]
  );

  const toggleReviewLike = useCallback(
    async (reviewId: number, shouldLike: boolean) => {
      const likeDelta = shouldLike ? 1 : -1;
      setLikePending(reviewId, true);
      updateReviewLikeLocally(reviewId, likeDelta, shouldLike);
      try {
        if (shouldLike) {
          await likeReviewRequest(reviewId);
        } else {
          await unlikeReviewRequest(reviewId);
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message);
        updateReviewLikeLocally(reviewId, -likeDelta, !shouldLike);
        throw err;
      } finally {
        setLikePending(reviewId, false);
      }
    },
    [setLikePending, updateReviewLikeLocally]
  );

  const isReviewLikePending = useCallback(
    (reviewId: number) => pendingLikeIds.has(reviewId),
    [pendingLikeIds]
  );

  return {
    reviews,
    averageRating,
    isLoading,
    error,
    isMutating,
    createReview,
    updateReview,
    deleteReview,
    refetch: loadReviews,
    toggleReviewLike,
    isReviewLikePending,
  };
};
