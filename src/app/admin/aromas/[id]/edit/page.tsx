import AromaEditForm from "@/components/aromas/AromaEditForm";

export default function AromaEditPage({ params }: { params: { id: string } }) {
  return <AromaEditForm id={params.id} />;
}
