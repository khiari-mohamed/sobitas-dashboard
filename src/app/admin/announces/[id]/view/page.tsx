import AnnouncesViewClient from "@/components/announces/AnnouncesViewClient";

export default async function AnnouncesViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AnnouncesViewClient id={id} />;
}
