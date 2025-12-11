"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ReviewFormValues } from "@/features/reviews/model/useReviews";
import { RatingInput } from "@/shared/ui/RatingInput";

export type ReviewFormProps = {
  initialValues?: Partial<ReviewFormValues>;
  onSubmit: (values: ReviewFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  isSubmitting?: boolean;
};

export const ReviewForm = ({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Submit",
  isSubmitting,
}: ReviewFormProps) => {
  const form = useForm<ReviewFormValues>({
    defaultValues: {
      rate: initialValues?.rate ?? 5,
      content: initialValues?.content ?? "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values);
    if (!initialValues) {
      form.reset({ rate: 5, content: "" });
    }
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 rounded-xl border border-stone-200 bg-stone-50 p-4"
    >
      <Controller
        control={form.control}
        name="rate"
        rules={{
          required: true,
          min: 0,
          max: 5,
        }}
        render={({ field }) => (
          <div className="flex flex-col gap-1">
            <Label>Rating</Label>
            <RatingInput
              value={field.value ?? 0}
              onChange={field.onChange}
              disabled={isSubmitting}
            />
            {form.formState.errors.rate && (
              <p className="text-xs text-red-500">
                Please provide a rating between 0 and 5.
              </p>
            )}
          </div>
        )}
      />
      <div className="flex flex-col gap-1">
        <Label htmlFor="content">Comment</Label>
        <Textarea
          id="content"
          rows={4}
          placeholder="Tell others about your experience..."
          {...form.register("content", { required: true, minLength: 10 })}
        />
        {form.formState.errors.content && (
          <p className="text-xs text-red-500">
            Please add at least a few words.
          </p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
};
