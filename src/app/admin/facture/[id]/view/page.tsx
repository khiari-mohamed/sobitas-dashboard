import FactureViewClient from "@/components/facture/FactureViewClient";

export default async function FactureViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FactureViewClient id={id} />;
}
