import ServicesEditForm from "@/components/services/ServicesEditForm";

export default function ServicesEditPage({ params }: { params: { id: string } }) {
  return <ServicesEditForm id={params.id} />;
}
