import SeoPagesViewClient from "@/components/seo_pages/SeoPagesViewClient";

export default async function SeoPagesViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SeoPagesViewClient id={id} />;
}
