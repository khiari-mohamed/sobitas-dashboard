import FaqsViewClient from "../../../../../components/faqs/FaqsViewClient";

export default function FaqsViewPage({ params }: { params: { id: string } }) {
  return <FaqsViewClient id={params.id} />;
}
