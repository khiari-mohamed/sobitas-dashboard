import ReviewsViewClient from "@/components/reviews/ReviewsViewClient";

// Make the function async and await params if necessary
export default async function ReviewsViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <ReviewsViewClient id={resolvedParams.id} />;
}
