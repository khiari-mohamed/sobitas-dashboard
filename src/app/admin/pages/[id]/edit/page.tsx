import PagesEditForm from "../../../../../components/pages/PagesEditForm";

export default function PagesEditPage({ params }: { params: { id: string } }) {
  return <PagesEditForm id={params.id} />;
}
