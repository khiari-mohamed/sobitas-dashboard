import NewsletterViewClient from "@/components/newsletter/NewsletterViewClient";

export default async function NewsletterViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NewsletterViewClient id={id} />;
}
