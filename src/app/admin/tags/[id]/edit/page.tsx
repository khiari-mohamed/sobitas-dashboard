import TagsEditForm from "@/components/tags/TagsEditForm";

export default async function TagsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TagsEditForm id={id} />;
}
