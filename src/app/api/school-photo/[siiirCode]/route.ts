import { getVerifiedSchoolImage } from "@/lib/school-images";

export async function GET(_request: Request, context: { params: Promise<{ siiirCode: string }> }) {
  const { siiirCode } = await context.params;
  const image = getVerifiedSchoolImage(siiirCode);
  if (!image || image.source !== "mapillary" || !image.mapillaryImageId) {
    return new Response("Fotografie negăsită", { status: 404 });
  }

  const token = process.env.MAPILLARY_ACCESS_TOKEN;
  if (!token) return new Response("Sursa fotografiei nu este configurată", { status: 503 });

  const detailsUrl = new URL(`https://graph.mapillary.com/${image.mapillaryImageId}`);
  detailsUrl.searchParams.set("access_token", token);
  detailsUrl.searchParams.set("fields", "thumb_1024_url");

  const detailsResponse = await fetch(detailsUrl, { next: { revalidate: 86_400 } });
  if (!detailsResponse.ok) return new Response("Sursa fotografiei nu răspunde", { status: 502 });
  const details = await detailsResponse.json() as { thumb_1024_url?: string };
  if (!details.thumb_1024_url) return new Response("Fotografie indisponibilă", { status: 404 });

  const imageResponse = await fetch(details.thumb_1024_url, { next: { revalidate: 86_400 } });
  if (!imageResponse.ok || !imageResponse.body) return new Response("Fotografie indisponibilă", { status: 502 });

  return new Response(imageResponse.body, {
    headers: {
      "Content-Type": imageResponse.headers.get("Content-Type") || "image/jpeg",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
