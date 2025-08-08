import EmailTemplatesEditForm from "@/components/email_templates/EmailTemplatesEditForm";

export default function EmailTemplatesEditPage({ params }: { params: { id: string } }) {
  return <EmailTemplatesEditForm id={params.id} />;
}
