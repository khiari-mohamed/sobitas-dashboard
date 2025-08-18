import TagsViewClient from "@/components/tags/TagsViewClient";

export default async function TagsViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TagsViewClient id={id} />;
}
