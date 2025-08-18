import SeoPagesEditForm from "@/components/seo_pages/SeoPagesEditForm";

export default async function SeoPagesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <SeoPagesEditForm id={id} />;
}
