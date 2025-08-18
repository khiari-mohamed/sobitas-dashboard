import AromaViewClient from "@/components/aromas/AromaViewClient";

export default async function AromaViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AromaViewClient id={id} />;
}
