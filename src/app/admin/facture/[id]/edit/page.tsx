import FactureEditForm from "@/components/facture/FactureEditForm";

export default function FactureEditPage({ params }: { params: { id: string } }) {
  return <FactureEditForm id={params.id} />;
}
