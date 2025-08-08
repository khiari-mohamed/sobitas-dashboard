import PaymentsViewClient from "@/components/payments/PaymentsViewClient";

export default async function PaymentsViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PaymentsViewClient id={resolvedParams.id} />;
}
