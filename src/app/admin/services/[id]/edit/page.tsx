import ServicesEditForm from "@/components/services/ServicesEditForm";

export default async function ServicesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServicesEditForm id={id} />;
}
