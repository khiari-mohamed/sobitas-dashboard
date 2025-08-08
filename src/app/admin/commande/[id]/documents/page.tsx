"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import factureService from "@/services/facture";
import BonCommande from "@/components/facture/BonCommande";
import BonLivraison from "@/components/facture/BonLivraison";
import Devis from "@/components/facture/Devis";
import FactureClient from "@/components/facture/FactureClient";
import FactureBoutique from "@/components/facture/FactureBoutique";
import TicketCaisse from "@/components/facture/TicketCaisse";

export default function CommandeAllDocumentsPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    factureService.fetchFactureById(id)
      .then(setOrder)
      .catch(() => setError("Facture introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!order) return null;

  return (
    <div className="py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Bon de Commande</h2>
          <BonCommande order={order} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Bon de Livraison</h2>
          <BonLivraison order={order} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Devis</h2>
          <Devis order={order} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Facture Client</h2>
          <FactureClient order={order} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Facture Boutique</h2>
          <FactureBoutique order={order} />
        </div>
        <div className="bg-white rounded shadow p-4">
          <h2 className="text-lg font-semibold mb-4 border-b pb-2">Ticket de Caisse</h2>
          <TicketCaisse order={order} />
        </div>
      </div>
    </div>
  );
}
