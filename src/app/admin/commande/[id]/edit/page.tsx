import CommandeEditForm from "@/components/commande/CommandeEditForm";

export default async function CommandeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CommandeEditForm id={id} />;
}
