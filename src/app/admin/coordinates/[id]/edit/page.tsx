import CoordinatesEditForm from "@/components/coordinates/CoordinatesEditForm";

export default function CoordinatesEditPage({ params }: { params: { id: string } }) {
  return <CoordinatesEditForm id={params.id} />;
}
