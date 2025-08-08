"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Facture } from "@/types/facture";
import factureService from "@/services/facture";

export default function FactureViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [facture, setFacture] = useState<Facture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    factureService.fetchFactureById(id)
      .then(setFacture)
      .catch(() => setError("Facture introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!facture) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1600px] mx-auto mt-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/facture")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          ← Retourner à la liste
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/facture/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          ✏️ Éditer
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Détails de la facture</h1>
      {/* Client Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Client</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Nom:</span> <span>{facture.nom || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Prénom:</span> <span>{facture.prenom || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Email:</span> <span>{facture.email || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Téléphone:</span> <span>{facture.phone || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Pays:</span> <span>{facture.pays || "—"}</span></div>
          {facture.billing_localite && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Localité (facturation):</span> <span>{facture.billing_localite}</span></div>}
          {facture.gouvernorat && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Gouvernorat:</span> <span>{facture.gouvernorat}</span></div>}
          {facture.adresse1 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 1:</span> <span>{facture.adresse1}</span></div>}
          {facture.adresse2 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 2:</span> <span>{facture.adresse2}</span></div>}
          {facture.region && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Région:</span> <span>{facture.region}</span></div>}
          {facture.ville && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Ville:</span> <span>{facture.ville}</span></div>}
          {facture.code_postale && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Code postale:</span> <span>{facture.code_postale}</span></div>}
        </div>
      </div>
      <hr className="my-8" />
      {/* Livraison Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Livraison</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Livraison:</span> <span>{facture.livraison || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Frais livraison:</span> <span>{facture.frais_livraison || "—"}</span></div>
          {facture.livraison_nom && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Nom (livraison):</span> <span>{facture.livraison_nom}</span></div>}
          {facture.livraison_prenom && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Prénom (livraison):</span> <span>{facture.livraison_prenom}</span></div>}
          {facture.livraison_adresse1 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 1 (livraison):</span> <span>{facture.livraison_adresse1}</span></div>}
          {facture.livraison_adresse2 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 2 (livraison):</span> <span>{facture.livraison_adresse2}</span></div>}
          {facture.livraison_email && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Email (livraison):</span> <span>{facture.livraison_email}</span></div>}
          {facture.livraison_phone && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Téléphone (livraison):</span> <span>{facture.livraison_phone}</span></div>}
          {facture.livraison_region && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Région (livraison):</span> <span>{facture.livraison_region}</span></div>}
          {facture.livraison_ville && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Ville (livraison):</span> <span>{facture.livraison_ville}</span></div>}
          {facture.livraison_code_postale && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Code postale (livraison):</span> <span>{facture.livraison_code_postale}</span></div>}
        </div>
      </div>
      <hr className="my-8" />
      {/* Payment Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Paiement</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Méthode de paiement:</span> <span>{facture.paymentMethod === "payme" ? "Carte Bancaire (Paymee)" : facture.paymentMethod === "cash" ? "Paiement à la livraison" : (facture.paymentMethod || "—")}</span></div>
          {facture.tva && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">TVA:</span> <span>{facture.tva}</span></div>}
          {facture.timbre && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Timbre:</span> <span>{facture.timbre}</span></div>}
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Remise:</span> <span>{facture.remise || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Total HT:</span> <span>{facture.prix_ht || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Total TTC:</span> <span>{facture.prix_ttc || "—"}</span></div>
        </div>
      </div>
      <hr className="my-8" />
      {/* Facture Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Facture</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Numéro de facture:</span> <span>{facture.numero || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">État:</span> <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: facture.etat === "payée" ? "#28a745" : "#f08c14", color: "#fff" }}>{facture.etat}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Date de création:</span> <span>{facture.created_at ? new Date(facture.created_at).toLocaleDateString() : "—"}</span></div>
          {facture.note && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Note:</span> <span>{facture.note}</span></div>}
          {facture.historique && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Historique:</span> <span>{facture.historique}</span></div>}
        </div>
      </div>
    </div>
  );
}
