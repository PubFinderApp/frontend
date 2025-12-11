"use client";

import { useCallback, useEffect, useState } from "react";
import type { Review } from "@/entities/review/model/types";
import { fetchReviewsByUser } from "@/shared/api/reviews";
import { ApiError } from "@/shared/api/client";

export const useUserReviews = (userId?: number | null) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadReviews = useCallback(async () => {
    if (!userId) {
      setReviews([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchReviewsByUser(userId);
      setReviews(response);
      setError(null);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadReviews();
  }, [loadReviews]);

  return {
    reviews,
    isLoading,
    error,
    refetch: loadReviews,
  };
};
