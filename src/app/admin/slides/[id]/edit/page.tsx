import SlidesEditForm from "@/components/slides/SlidesEditForm";

export default async function SlidesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SlidesEditForm id={id} />;
}
