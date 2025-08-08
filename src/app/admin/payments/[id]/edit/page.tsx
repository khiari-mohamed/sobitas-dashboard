import PaymentsEditForm from "@/components/payments/PaymentsEditForm";

export default async function PaymentsEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PaymentsEditForm id={resolvedParams.id} />;
}
