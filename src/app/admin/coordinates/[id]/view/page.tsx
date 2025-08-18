import CoordinatesViewClient from "@/components/coordinates/CoordinatesViewClient";

export default async function CoordinatesViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CoordinatesViewClient id={id} />;
}
