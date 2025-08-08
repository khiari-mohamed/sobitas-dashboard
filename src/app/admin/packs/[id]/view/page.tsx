import PacksViewClient from "@/components/packs/PacksViewClient";

export default async function PacksViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  return <PacksViewClient id={resolvedParams.id} />;
}
