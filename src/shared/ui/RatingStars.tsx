"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type RatingStarsProps = {
  rating: number | null;
  compact?: boolean;
};

export const RatingStars = ({ rating, compact }: RatingStarsProps) => {
  if (rating === null || rating === undefined) {
    return <span className="text-sm text-stone-500">No ratings yet</span>;
  }

  return (
    <div className={cn("flex items-center gap-1", compact && "gap-0.5")}>
      {Array.from({ length: 5 }).map((_, index) => {
        const value = index + 1;
        const filled = rating >= value - 0.25;
        return (
          <Star
            key={value}
            className={cn(
              "h-4 w-4",
              filled ? "fill-yellow-400 text-yellow-500" : "text-stone-300"
            )}
          />
        );
      })}
      <span className="ml-2 text-sm font-medium text-stone-700">
        {Number(rating).toFixed(1)}
      </span>
    </div>
  );
};
