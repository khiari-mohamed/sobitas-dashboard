import AnnouncesEditForm from "@/components/announces/AnnouncesEditForm";

export default async function AnnouncesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AnnouncesEditForm id={id} />;
}
