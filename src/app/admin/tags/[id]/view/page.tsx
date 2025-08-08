import TagsViewClient from "@/components/tags/TagsViewClient";

export default function TagsViewPage({ params }: { params: { id: string } }) {
  return <TagsViewClient id={params.id} />;
}
