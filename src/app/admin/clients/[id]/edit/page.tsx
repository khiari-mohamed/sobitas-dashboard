import ClientsEditForm from "@/components/clients/ClientsEditForm";

export default async function ClientsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ClientsEditForm id={id} />;
}
