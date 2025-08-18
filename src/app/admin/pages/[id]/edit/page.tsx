import PagesEditForm from "../../../../../components/pages/PagesEditForm";

export default async function PagesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PagesEditForm id={id} />;
}
