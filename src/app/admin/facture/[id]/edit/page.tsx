import FactureEditForm from "@/components/facture/FactureEditForm";

export default async function FactureEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FactureEditForm id={id} />;
}
