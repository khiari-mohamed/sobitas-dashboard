import AnnouncesViewClient from "@/components/announces/AnnouncesViewClient";

export default function AnnouncesViewPage({ params }: { params: { id: string } }) {
  return <AnnouncesViewClient id={params.id} />;
}
