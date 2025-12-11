import { memo } from "react";
import { RatingStars } from "@/shared/ui/RatingStars";
import type { Review } from "@/entities/review/model/types";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export type ReviewCardProps = {
  review: Review;
  canEdit?: boolean;
  onEdit?: (review: Review) => void;
  onDelete?: (review: Review) => void;
  onToggleLike?: (review: Review) => void;
  isLikePending?: boolean;
};

const formatter = new Intl.DateTimeFormat("en", {
  dateStyle: "medium",
});

export const ReviewCard = memo(
  ({
    review,
    canEdit,
    onEdit,
    onDelete,
    onToggleLike,
    isLikePending,
  }: ReviewCardProps) => {
    const liked = review.likedByCurrentUser ?? false;

    return (
      <div className="rounded-xl border border-stone-200 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm font-semibold text-stone-900">
              @{review.username}
            </p>
            <p className="text-xs text-stone-500">
              {formatter.format(new Date(review.createdAt))}
            </p>
          </div>
          <RatingStars rating={review.rate} compact />
        </div>
        <p className="mt-3 text-sm text-stone-700">{review.content}</p>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            disabled={isLikePending}
            aria-pressed={liked}
            onClick={() => onToggleLike?.(review)}
            className={cn(
              "flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              liked
                ? "bg-rose-50 text-rose-600 hover:bg-rose-100"
                : "text-stone-500 hover:bg-rose-50 hover:text-rose-600"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4",
                liked
                  ? "fill-current text-rose-600"
                  : "text-stone-500 fill-transparent"
              )}
              aria-hidden="true"
            />
            <span>{review.likeCount}</span>
            <span className="text-xs font-normal">
              {review.likeCount === 1 ? "like" : "likes"}
            </span>
          </button>
          {canEdit && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit?.(review)}
              >
                Edit
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete?.(review)}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
);

ReviewCard.displayName = "ReviewCard";
