import AromaViewClient from "@/components/aromas/AromaViewClient";

export default function AromaViewPage({ params }: { params: { id: string } }) {
  return <AromaViewClient id={params.id} />;
}
