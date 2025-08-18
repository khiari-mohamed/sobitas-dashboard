import ClientsViewClient from "@/components/clients/ClientsViewClient";

export default async function ClientsViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientsViewClient id={id} />;
}
