import CommandeEditForm from "@/components/commande/CommandeEditForm";

export default function CommandeEditPage({ params }: { params: { id: string } }) {
  return <CommandeEditForm id={params.id} />;
}
