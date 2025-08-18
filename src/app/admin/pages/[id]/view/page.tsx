import PagesViewClient from "../../../../../components/pages/PagesViewClient";

export default async function PagesViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PagesViewClient id={id} />;
}
