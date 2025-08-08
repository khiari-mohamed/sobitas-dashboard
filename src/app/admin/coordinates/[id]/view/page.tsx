import CoordinatesViewClient from "@/components/coordinates/CoordinatesViewClient";

export default function CoordinatesViewPage({ params }: { params: { id: string } }) {
  return <CoordinatesViewClient id={params.id} />;
}
