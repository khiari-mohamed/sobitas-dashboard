import CommandeViewClient from "@/components/commande/CommandeViewClient";

export default function CommandeViewPage({ params }: { params: { id: string } }) {
  return <CommandeViewClient id={params.id} />;
}
