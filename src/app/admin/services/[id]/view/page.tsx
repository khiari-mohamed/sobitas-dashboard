import ServicesViewClient from "@/components/services/ServicesViewClient";

export default async function ServicesViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ServicesViewClient id={id} />;
}
