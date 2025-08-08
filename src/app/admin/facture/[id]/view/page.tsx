import FactureViewClient from "@/components/facture/FactureViewClient";

export default function FactureViewPage({ params }: { params: { id: string } }) {
  return <FactureViewClient id={params.id} />;
}
