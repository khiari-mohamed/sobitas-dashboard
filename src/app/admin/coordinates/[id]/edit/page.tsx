import CoordinatesEditForm from "@/components/coordinates/CoordinatesEditForm";

export default async function CoordinatesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CoordinatesEditForm id={id} />;
}
