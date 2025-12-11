"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AuthGuard } from "@/features/auth/ui/AuthGuard";
import { useAuth } from "@/features/auth/model/useAuth";
import { useUserReviews } from "@/features/reviews/model/useUserReviews";
import { RatingStars } from "@/shared/ui/RatingStars";

const formatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

function AccountContent() {
  const { user } = useAuth();
  const { reviews, isLoading, error } = useUserReviews(user?.accountId);

  if (!user) {
    return null;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
      <Card className="border-stone-200">
        <CardHeader>
          <CardTitle className="text-2xl text-stone-900">My Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-stone-600">
          <div className="flex flex-col gap-1 rounded-2xl bg-stone-50 p-4">
            <span className="text-xs uppercase tracking-wide text-stone-500">
              Username
            </span>
            <span className="text-lg font-semibold text-stone-900">
              @{user.username}
            </span>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-stone-100 bg-white p-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-stone-500">
                Reviews written
              </p>
              <p className="text-2xl font-bold text-stone-900">
                {reviews.length}
              </p>
            </div>
            <p className="text-xs text-stone-500">
              Latest update: {formatter.format(new Date())}
            </p>
          </div>
        </CardContent>
      </Card>

      <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-stone-900">
              My Reviews
            </h2>
            <p className="text-sm text-stone-500">
              Every pub experience you have shared so far.
            </p>
          </div>
          <p className="text-sm text-stone-500">
            {reviews.length} review{reviews.length === 1 ? "" : "s"}
          </p>
        </div>

        {isLoading && (
          <p className="mt-4 text-sm text-stone-500">
            Loading your reviews&hellip;
          </p>
        )}
        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {!isLoading && !error && reviews.length === 0 && (
          <p className="mt-4 text-sm text-stone-500">
            You have not posted any reviews yet. Visit a pub page to share your
            thoughts.
          </p>
        )}

        {!isLoading && reviews.length > 0 && (
          <div className="mt-4 space-y-4">
            {reviews.map((review) => (
              <article
                key={review.id}
                className="rounded-2xl border border-stone-100 bg-stone-50 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-stone-500">
                      Pub
                    </p>
                    <p className="text-lg font-semibold text-stone-900">
                      {review.pubTitle}
                    </p>
                  </div>
                  <RatingStars rating={review.rate} />
                </div>
                <p className="mt-3 text-sm text-stone-700">{review.content}</p>
                <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-stone-500">
                  <span>
                    Posted {formatter.format(new Date(review.createdAt))}
                  </span>
                  <div className="flex items-center gap-3">
                    <span>
                      {review.likeCount}{" "}
                      {review.likeCount === 1 ? "like" : "likes"}
                    </span>
                    <Link
                      href={`/pubs/${review.pubId}`}
                      className="font-medium text-orange-600 hover:text-orange-700"
                    >
                      View pub
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default function AccountPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-white to-stone-50 px-4 py-12">
      <AuthGuard fallbackMessage="Please login to view your account.">
        <AccountContent />
      </AuthGuard>
    </div>
  );
}
