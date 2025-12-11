import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PubDetails } from "@/widgets/pub-details/ui/PubDetails";
import { fetchPubById } from "@/shared/api/pubs";
import type { Pub } from "@/entities/pub/model/types";

type PubPageProps = {
  params: Promise<{ id: string }>;
};

export const revalidate = 0;

async function loadPub(idParam: string) {
  const pubId = Number(idParam);
  if (Number.isNaN(pubId)) {
    throw new Error("Invalid pub id");
  }

  return fetchPubById(pubId);
}

export async function generateMetadata({
  params,
}: PubPageProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const pub = await loadPub(id);
    return {
      title: `${pub.title} | PubFinder`,
      description: pub.shortDescription,
    };
  } catch {
    return {
      title: "Pub not found",
    };
  }
}

export default async function PubPage({ params }: PubPageProps) {
  const { id } = await params;
  let pub: Pub | null = null;
  try {
    pub = await loadPub(id);
  } catch (error) {
    console.error("Failed to load pub", error);
    notFound();
  }

  if (!pub) {
    notFound();
  }

  return <PubDetails pub={pub} />;
}
