"use client";
import React, { useEffect, useState, use } from "react";
import { useSearchParams } from "next/navigation";
import factureService from "@/services/facture";
import { Facture } from "@/types/facture";
import BonCommande from "@/components/facture/BonCommande";
import BonLivraison from "@/components/facture/BonLivraison";
import Devis from "@/components/facture/Devis";
import FactureClient from "@/components/facture/FactureClient";
import FactureBoutique from "@/components/facture/FactureBoutique";
import TicketCaisse from "@/components/facture/TicketCaisse";

const DOC_COMPONENTS: Record<string, React.ComponentType<{ order: Record<string, unknown> }>> = {
  "bon-commande": BonCommande,
  "bon-livraison": BonLivraison,
  "devis": Devis,
  "facture-client": FactureClient,
  "facture-boutique": FactureBoutique,
  "ticket-caisse": TicketCaisse,
};

export default function FactureDocumentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const doc = searchParams?.get("doc") || "bon-commande";
  const [order, setOrder] = useState<Facture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    factureService.fetchFactureById(id)
      .then(setOrder)
      .catch(() => setError("Facture introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!order) return null;

  const DocComponent = DOC_COMPONENTS[doc] || BonCommande;

  return (
    <div className="py-8">
      <DocComponent order={order as unknown as Record<string, unknown>} />
    </div>
  );
}