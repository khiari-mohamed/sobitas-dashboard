import EmailTemplatesViewClient from "@/components/email_templates/EmailTemplatesViewClient";

export default async function EmailTemplatesViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EmailTemplatesViewClient id={id} />;
}
