import EmailTemplatesEditForm from "@/components/email_templates/EmailTemplatesEditForm";

export default async function EmailTemplatesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmailTemplatesEditForm id={id} />;
}
