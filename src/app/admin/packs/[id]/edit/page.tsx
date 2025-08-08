import PacksEditForm from "@/components/packs/PacksEditFormClient";

export default async function PacksEditPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PacksEditForm id={resolvedParams.id} />;
}
