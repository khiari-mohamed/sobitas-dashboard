import AromaEditForm from "@/components/aromas/AromaEditForm";

export default async function AromaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <AromaEditForm id={id} />;
}
