import NewsletterViewClient from "@/components/newsletter/NewsletterViewClient";

export default function NewsletterViewPage({ params }: { params: { id: string } }) {
  return <NewsletterViewClient id={params.id} />;
}
