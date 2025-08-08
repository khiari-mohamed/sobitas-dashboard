import ServicesViewClient from "@/components/services/ServicesViewClient";

export default function ServicesViewPage({ params }: { params: { id: string } }) {
  return <ServicesViewClient id={params.id} />;
}
