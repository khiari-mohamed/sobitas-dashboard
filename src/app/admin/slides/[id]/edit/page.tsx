import SlidesEditForm from "@/components/slides/SlidesEditForm";

export default function SlidesEditPage({ params }: { params: { id: string } }) {
  return <SlidesEditForm id={params.id} />;
}
