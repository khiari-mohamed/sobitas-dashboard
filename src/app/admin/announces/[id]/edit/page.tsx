import AnnouncesEditForm from "@/components/announces/AnnouncesEditForm";

export default function AnnouncesEditPage({ params }: { params: { id: string } }) {
  return <AnnouncesEditForm id={params.id} />;
}
