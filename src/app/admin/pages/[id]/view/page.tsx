import PagesViewClient from "../../../../../components/pages/PagesViewClient";

export default function PagesViewPage({ params }: { params: { id: string } }) {
  return <PagesViewClient id={params.id} />;
}
