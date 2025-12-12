import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RatingStars } from "@/shared/ui/RatingStars";
import type { Pub } from "@/entities/pub/model/types";

export type PubCardProps = {
  pub: Pub;
};

export const PubCard = ({ pub }: PubCardProps) => {
  return (
    <Card className="flex flex-col overflow-hidden border-none shadow-sm">
      <div className="relative h-48 w-full overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={pub.imageUrl}
          alt={pub.title}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-stone-900">
          {pub.title}
        </CardTitle>
        <p className="text-sm text-stone-500">{pub.shortDescription}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <RatingStars rating={pub.rating ?? null} />
        {pub.rating ? (
          <span className="text-sm text-stone-600">
            Average rating {pub.rating.toFixed(1)} / 5
          </span>
        ) : (
          <span className="text-sm text-stone-500">No ratings yet</span>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button asChild className="w-full">
          <Link href={`/pubs/${pub.id}`}>Touch me</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
