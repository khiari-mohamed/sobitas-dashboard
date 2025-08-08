import ReviewsEditForm from "@/components/reviews/ReviewsEditForm";

export default function ReviewsEditPage({ params }: { params: { id: string } }) {
  return <ReviewsEditForm id={params.id} />;
}
