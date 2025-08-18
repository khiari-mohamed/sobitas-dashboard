import CommandeViewClient from "@/components/commande/CommandeViewClient";

export default async function CommandeViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommandeViewClient id={id} />;
}
