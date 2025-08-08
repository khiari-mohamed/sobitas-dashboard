import ClientsViewClient from "@/components/clients/ClientsViewClient";

export default function ClientsViewPage({ params }: { params: { id: string } }) {
  return <ClientsViewClient id={params.id} />;
}
