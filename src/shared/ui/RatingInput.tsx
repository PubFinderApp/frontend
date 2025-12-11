"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type RatingInputProps = {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  disabled?: boolean;
  className?: string;
};

export const RatingInput = ({
  value,
  onChange,
  max = 5,
  disabled,
  className,
}: RatingInputProps) => {
  const [hovered, setHovered] = useState<number | null>(null);
  const displayValue = hovered ?? value ?? 0;

  return (
    <div
      className={cn(
        "flex items-center gap-1 rounded-2xl border border-transparent bg-white px-3 py-2",
        disabled ? "opacity-60" : "cursor-pointer",
        className
      )}
      role="radiogroup"
      aria-disabled={disabled}
    >
      {Array.from({ length: max }).map((_, index) => {
        const currentValue = index + 1;
        const filled = displayValue >= currentValue;
        return (
          <button
            key={currentValue}
            type="button"
            role="radio"
            aria-checked={value === currentValue}
            disabled={disabled}
            onClick={() => onChange(currentValue)}
            onMouseEnter={() => setHovered(currentValue)}
            onMouseLeave={() => setHovered(null)}
            className="transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed"
          >
            <Star
              className={cn(
                "h-6 w-6",
                filled
                  ? "fill-yellow-400 text-yellow-500"
                  : "text-stone-300"
              )}
            />
            <span className="sr-only">{currentValue} star</span>
          </button>
        );
      })}
    </div>
  );
};
