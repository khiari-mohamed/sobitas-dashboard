import FaqsEditForm from "../../../../../components/faqs/FaqsEditForm";

export default async function FaqsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaqsEditForm id={id} />;
}
