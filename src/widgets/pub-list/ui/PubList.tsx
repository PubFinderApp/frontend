import { PubCard } from "@/entities/pub/ui/PubCard";
import { fetchPubs } from "@/shared/api/pubs";
import type { Pub } from "@/entities/pub/model/types";

export const PubList = async () => {
  let pubs: Pub[] = [];
  let error: string | null = null;

  try {
    pubs = await fetchPubs({ sortBy: "desc" });
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load pubs.";
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-orange-600">
          Explore
        </p>
        <h1 className="text-3xl font-bold text-stone-900">
          Discover local pubs
        </h1>
        <p className="text-stone-600">
          Browse curated spots and read honest feedback from the community.
        </p>
      </div>
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pubs.map((pub) => (
            <PubCard key={pub.id} pub={pub} />
          ))}
        </div>
      )}
    </section>
  );
};
