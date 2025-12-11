"use client";

import { useState } from "react";
import type { Pub } from "@/entities/pub/model/types";
import type { Review } from "@/entities/review/model/types";
import { RatingStars } from "@/shared/ui/RatingStars";
import { useReviews } from "@/features/reviews/model/useReviews";
import { ReviewCard } from "@/entities/review/ui/ReviewCard";
import { ReviewForm } from "@/features/reviews/ui/ReviewForm";
import { useAuth } from "@/features/auth/model/useAuth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";

export type PubDetailsProps = {
  pub: Pub;
};

export const PubDetails = ({ pub }: PubDetailsProps) => {
  const { user } = useAuth();
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null);
  const {
    reviews,
    averageRating,
    isLoading,
    error,
    createReview,
    updateReview,
    deleteReview,
    isMutating,
    toggleReviewLike,
    isReviewLikePending,
  } = useReviews(pub.id);

  const reviewCount = reviews.length;

  const handleDelete = async (reviewId: number) => {
    const confirmed = window.confirm("Delete this review?");
    if (!confirmed) return;
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted.");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete the review.";
      toast.error(message);
    }
  };

  const canEdit = (authorId: number) => !!user && authorId === user.accountId;

  const handleToggleLike = async (review: Review) => {
    if (!user) {
      toast.error("Please login to like reviews.");
      return;
    }
    try {
      await toggleReviewLike(review.id, !(review.likedByCurrentUser ?? false));
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update like.";
      toast.error(message);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-sm">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pub.imageUrl}
          alt={pub.title}
          className="h-72 w-full object-cover"
        />
        <div className="space-y-4 p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-wide text-orange-600">
              Featured pub
            </p>
            <h1 className="text-3xl font-bold text-stone-900">{pub.title}</h1>
          </div>
          <p className="text-lg text-stone-600">{pub.longDescription}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
            <RatingStars rating={averageRating ?? pub.rating} />
            <span>•</span>
            <span>
              {reviewCount} review{reviewCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">Reviews</h2>
            <p className="text-sm text-stone-500">
              Honest experiences from the community
            </p>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">Back to list</Link>
          </Button>
        </div>

        {isLoading && (
          <p className="text-sm text-stone-500">Loading reviews…</p>
        )}
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {!isLoading && reviews.length === 0 && (
          <p className="text-sm text-stone-500">
            No reviews yet. Be the first to share your thoughts!
          </p>
        )}

        <div className="space-y-4">
          {reviews.map((review) =>
            editingReviewId === review.id ? (
              <ReviewForm
                key={review.id}
                initialValues={{ rate: review.rate, content: review.content }}
                submitLabel="Save changes"
                onSubmit={async (values) => {
                  try {
                    await updateReview(review.id, values);
                    setEditingReviewId(null);
                    toast.success("Review updated.");
                  } catch (err) {
                    const message =
                      err instanceof Error
                        ? err.message
                        : "Failed to update the review.";
                    toast.error(message);
                  }
                }}
                onCancel={() => setEditingReviewId(null)}
                isSubmitting={isMutating}
              />
            ) : (
              <ReviewCard
                key={review.id}
                review={review}
                canEdit={!!user && canEdit(review.userId)}
                onEdit={(current) => setEditingReviewId(current.id)}
                onDelete={(current) => handleDelete(current.id)}
                onToggleLike={(current) => handleToggleLike(current)}
                isLikePending={isReviewLikePending(review.id)}
              />
            )
          )}
        </div>
      </section>

      <section className="space-y-4 rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div>
          <h3 className="text-xl font-semibold text-stone-900">
            Share your review
          </h3>
          <p className="text-sm text-stone-500">
            Help others decide if this pub is right for them.
          </p>
        </div>
        {user ? (
          <ReviewForm
            submitLabel="Post review"
            onSubmit={async (values) => {
              try {
                await createReview(values);
                setEditingReviewId(null);
                toast.success("Review posted. Thanks for sharing!");
              } catch (err) {
                const message =
                  err instanceof Error
                    ? err.message
                    : "Failed to create the review.";
                toast.error(message);
              }
            }}
            isSubmitting={isMutating}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 p-4 text-sm text-stone-700">
            Please login to leave a review.
            <Button variant="link" asChild className="text-orange-700">
              <Link href="/login">Go to login</Link>
            </Button>
          </div>
        )}
      </section>
    </div>
  );
};
