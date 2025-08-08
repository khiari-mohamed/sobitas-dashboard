import TagsEditForm from "@/components/tags/TagsEditForm";

export default function TagsEditPage({ params }: { params: { id: string } }) {
  return <TagsEditForm id={params.id} />;
}
