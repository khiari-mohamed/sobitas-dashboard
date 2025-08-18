import FaqsViewClient from "../../../../../components/faqs/FaqsViewClient";

export default async function FaqsViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <FaqsViewClient id={id} />;
}
