import NewsletterEditForm from "@/components/newsletter/NewsletterEditForm";

export default function NewsletterEditPage({ params }: { params: { id: string } }) {
  return <NewsletterEditForm id={params.id} />;
}
