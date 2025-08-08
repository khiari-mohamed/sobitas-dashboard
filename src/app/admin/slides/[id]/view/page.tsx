import SlidesViewClient from "@/components/slides/SlidesViewClient";

export default function SlidesViewPage({ params }: { params: { id: string } }) {
  return <SlidesViewClient id={params.id} />;
}
