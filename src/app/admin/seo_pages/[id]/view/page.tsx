import SeoPagesViewClient from "@/components/seo_pages/SeoPagesViewClient";

export default function SeoPagesViewPage({ params }: { params: { id: string } }) {
  return <SeoPagesViewClient id={params.id} />;
}
