import FaqsEditForm from "../../../../../components/faqs/FaqsEditForm";

export default function FaqsEditPage({ params }: { params: { id: string } }) {
  return <FaqsEditForm id={params.id} />;
}
