import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProfileVariant } from "@/components/profile-variant";
import {
  profileVariantKinds,
  profileVariantLabels,
  type ProfileVariantKind,
} from "@/lib/profile-variants";

export const dynamicParams=false;
export function generateStaticParams() {
  return profileVariantKinds.map((kind) => ({ kind }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ kind: string }>;
}): Promise<Metadata> {
  const kind = (await params).kind;
  if (!profileVariantKinds.includes(kind as ProfileVariantKind)) {
    return { title: "Profil negăsit" };
  }
  const label = profileVariantLabels[kind as ProfileVariantKind];
  return {
    title: `Profil ${label} — Top Edu`,
    description: `Model de profil pentru ${label.toLowerCase()}, cu date publice și surse verificabile în Top Edu.`,
    alternates: { canonical: `/profiluri/${kind}` },
  };
}

export default async function VariantPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const kind = (await params).kind as ProfileVariantKind;
  if (!profileVariantKinds.includes(kind)) notFound();
  return <ProfileVariant kind={kind} />;
}
