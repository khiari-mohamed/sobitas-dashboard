"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Commande } from "@/types/commande";
import commandeService from "@/services/commande";

export default function CommandeViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    commandeService.fetchCommandeById(id)
      .then(setCommande)
      .catch(() => setError("Commande introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!commande) return null;

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1600px] mx-auto mt-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/commande")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          ← Retourner à la liste
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/commande/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          ✏️ Éditer
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Détails de la commande</h1>
      {/* Client Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Client</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Nom:</span> <span>{commande.nom || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Prénom:</span> <span>{commande.prenom || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Email:</span> <span>{commande.email || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Téléphone:</span> <span>{commande.phone || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Pays:</span> <span>{commande.pays || "—"}</span></div>
          {commande.billing_localite && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Localité (facturation):</span> <span>{commande.billing_localite}</span></div>}
          {commande.gouvernorat && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Gouvernorat:</span> <span>{commande.gouvernorat}</span></div>}
          {commande.adresse1 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 1:</span> <span>{commande.adresse1}</span></div>}
          {commande.adresse2 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 2:</span> <span>{commande.adresse2}</span></div>}
          {commande.region && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Région:</span> <span>{commande.region}</span></div>}
          {commande.ville && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Ville:</span> <span>{commande.ville}</span></div>}
          {commande.code_postale && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Code postale:</span> <span>{commande.code_postale}</span></div>}
        </div>
      </div>
      <hr className="my-8" />
      {/* Livraison Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Livraison</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Livraison:</span> <span>{commande.livraison || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Frais livraison:</span> <span>{commande.frais_livraison || "—"}</span></div>
          {commande.livraison_nom && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Nom (livraison):</span> <span>{commande.livraison_nom}</span></div>}
          {commande.livraison_prenom && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Prénom (livraison):</span> <span>{commande.livraison_prenom}</span></div>}
          {commande.livraison_adresse1 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 1 (livraison):</span> <span>{commande.livraison_adresse1}</span></div>}
          {commande.livraison_adresse2 && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Adresse 2 (livraison):</span> <span>{commande.livraison_adresse2}</span></div>}
          {commande.livraison_email && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Email (livraison):</span> <span>{commande.livraison_email}</span></div>}
          {commande.livraison_phone && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Téléphone (livraison):</span> <span>{commande.livraison_phone}</span></div>}
          {commande.livraison_region && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Région (livraison):</span> <span>{commande.livraison_region}</span></div>}
          {commande.livraison_ville && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Ville (livraison):</span> <span>{commande.livraison_ville}</span></div>}
          {commande.livraison_code_postale && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Code postale (livraison):</span> <span>{commande.livraison_code_postale}</span></div>}
        </div>
      </div>
      <hr className="my-8" />
      {/* Payment Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Paiement</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Méthode de paiement:</span> <span>{commande.paymentMethod === "payme" ? "Carte Bancaire (Paymee)" : commande.paymentMethod === "cash" ? "Paiement à la livraison" : (commande.paymentMethod || "—")}</span></div>
          {commande.tva && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">TVA:</span> <span>{commande.tva}</span></div>}
          {commande.timbre && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Timbre:</span> <span>{commande.timbre}</span></div>}
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Remise:</span> <span>{commande.remise || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Total HT:</span> <span>{commande.prix_ht || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Total TTC:</span> <span>{commande.prix_ttc || "—"}</span></div>
        </div>
      </div>
      <hr className="my-8" />
      {/* Command Info */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Commande</h2>
        <div className="space-y-2 divide-y">
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Numéro de commande:</span> <span>{commande.numero || "—"}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">État:</span> <span className="text-xs px-2 py-1 rounded font-semibold" style={{ background: commande.etat === "nouvelle_commande" ? "#f08c14" : "#3074fc", color: "#fff" }}>{commande.etat}</span></div>
          <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Date de création:</span> <span>{commande.created_at ? new Date(commande.created_at).toLocaleDateString() : "—"}</span></div>
          {commande.note && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Note:</span> <span>{commande.note}</span></div>}
          {commande.historique && <div className="py-2 flex justify-between"><span className="font-semibold text-gray-600">Historique:</span> <span>{commande.historique}</span></div>}
        </div>
      </div>
      <hr className="my-8" />
      {/* Products */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Produits</h2>
        {commande.cart && commande.cart.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full border divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-[#f9fafb] text-gray-700">
                <tr>
                  <th className="px-4 py-2">Produit</th>
                  <th className="px-4 py-2">Quantité</th>
                  <th className="px-4 py-2">Prix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {commande.cart.map((item: Record<string, unknown>) => (
                  <tr key={String(item._id || item.title)}>
                    <td className="px-4 py-2">{String(item.title)}</td>
                    <td className="px-4 py-2">{String(item.quantity)}</td>
                    <td className="px-4 py-2">{String(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mb-4 text-lg">Aucun produit</div>
        )}
      </div>
    </div>
  );
}
