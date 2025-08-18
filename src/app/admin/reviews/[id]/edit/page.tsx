import ReviewsEditForm from "@/components/reviews/ReviewsEditForm";

export default async function ReviewsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ReviewsEditForm id={id} />;
}
