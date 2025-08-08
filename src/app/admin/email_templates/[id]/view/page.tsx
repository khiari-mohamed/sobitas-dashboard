import EmailTemplatesViewClient from "@/components/email_templates/EmailTemplatesViewClient";

export default function EmailTemplatesViewPage({ params }: { params: { id: string } }) {
  return <EmailTemplatesViewClient id={params.id} />;
}
