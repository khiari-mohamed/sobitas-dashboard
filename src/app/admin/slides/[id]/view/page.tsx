import SlidesViewClient from "@/components/slides/SlidesViewClient";

export default async function SlidesViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SlidesViewClient id={id} />;
}
