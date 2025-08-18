import NewsletterEditForm from "@/components/newsletter/NewsletterEditForm";

export default async function NewsletterEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NewsletterEditForm id={id} />;
}
