import ClientsEditForm from "@/components/clients/ClientsEditForm";

export default function ClientsEditPage({ params }: { params: { id: string } }) {
  return <ClientsEditForm id={params.id} />;
}
