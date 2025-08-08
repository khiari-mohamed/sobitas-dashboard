import SeoPagesEditForm from "@/components/seo_pages/SeoPagesEditForm";

export default function SeoPagesEditPage({ params }: { params: { id: string } }) {
  return <SeoPagesEditForm id={params.id} />;
}
