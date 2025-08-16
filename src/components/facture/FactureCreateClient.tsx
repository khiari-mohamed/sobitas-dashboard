"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Facture } from "@/types/facture";
import factureService from "@/services/facture";

const initialState: Partial<Facture> = {
  nom: "",
  prenom: "",
  email: "",
  phone: "",
  prix_ht: "",
  prix_ttc: "",
  etat: "nouvelle_facture",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  pays: "Tunisie",
  numero: "",
  type: "",
  remise: "",
  note: "",
  frais_livraison: "",
  livraison: "",
  paymentMethod: "cash",
  billing_localite: "",
  gouvernorat: "",
  adresse1: "",
  adresse2: "",
  region: "",
  ville: "",
  code_postale: "",
  livraison_nom: "",
  livraison_prenom: "",
  livraison_adresse1: "",
  livraison_adresse2: "",
  livraison_email: "",
  livraison_phone: "",
  livraison_region: "",
  livraison_ville: "",
  livraison_code_postale: "",
  tva: "",
  timbre: "",
};

export default function FactureCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Facture>>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Generate a unique numero if not provided
      const numero = form.numero && form.numero.trim() !== "" ? form.numero : `FAC-${Date.now()}`;
      const factureData = { ...form, numero };
      await factureService.createFacture(factureData);
      router.push("/admin/facture");
    } catch (err: any) {
      setError("Erreur lors de la création de la facture.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1600px] mx-auto mt-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Créer une nouvelle facture</h1>
      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Client Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Client</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Nom</label>
              <input type="text" name="nom" value={form.nom || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Prénom</label>
              <input type="text" name="prenom" value={form.prenom || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Téléphone</label>
              <input type="text" name="phone" value={form.phone || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Pays</label>
              <input type="text" name="pays" value={form.pays || "Tunisie"} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Localité (facturation)</label>
              <input type="text" name="billing_localite" value={form.billing_localite || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Gouvernorat</label>
              <input type="text" name="gouvernorat" value={form.gouvernorat || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Adresse 1</label>
              <input type="text" name="adresse1" value={form.adresse1 || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Adresse 2</label>
              <input type="text" name="adresse2" value={form.adresse2 || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Région</label>
              <input type="text" name="region" value={form.region || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Ville</label>
              <input type="text" name="ville" value={form.ville || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Code postale</label>
              <input type="text" name="code_postale" value={form.code_postale || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
          </div>
        </div>
        <hr className="my-8" />
        {/* Livraison Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Livraison</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Livraison</label>
              <input type="text" name="livraison" value={form.livraison || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Frais livraison</label>
              <input type="number" name="frais_livraison" value={form.frais_livraison || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Nom (livraison)</label>
              <input type="text" name="livraison_nom" value={form.livraison_nom || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Prénom (livraison)</label>
              <input type="text" name="livraison_prenom" value={form.livraison_prenom || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Adresse 1 (livraison)</label>
              <input type="text" name="livraison_adresse1" value={form.livraison_adresse1 || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Adresse 2 (livraison)</label>
              <input type="text" name="livraison_adresse2" value={form.livraison_adresse2 || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Email (livraison)</label>
              <input type="email" name="livraison_email" value={form.livraison_email || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Téléphone (livraison)</label>
              <input type="text" name="livraison_phone" value={form.livraison_phone || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Région (livraison)</label>
              <input type="text" name="livraison_region" value={form.livraison_region || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Ville (livraison)</label>
              <input type="text" name="livraison_ville" value={form.livraison_ville || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Code postale (livraison)</label>
              <input type="text" name="livraison_code_postale" value={form.livraison_code_postale || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
          </div>
        </div>
        <hr className="my-8" />
        {/* Payment Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Paiement</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Méthode de paiement</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod || "cash"}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="cash">Paiement à la livraison</option>
                <option value="payme">Carte Bancaire (Paymee)</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Remise</label>
              <input type="text" name="remise" value={form.remise || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">TVA</label>
              <input type="text" name="tva" value={form.tva || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Timbre</label>
              <input type="text" name="timbre" value={form.timbre || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
          </div>
        </div>
        <hr className="my-8" />
        {/* Facture Info */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Informations Facture</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block mb-2 font-semibold">Numéro de facture</label>
              <input type="text" name="numero" value={form.numero || ""} onChange={handleChange} className="w-full border p-3 rounded" placeholder="Auto-généré si vide" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">État</label>
              <select
                name="etat"
                value={form.etat || "nouvelle_facture"}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="nouvelle_facture">Nouvelle facture</option>
                <option value="payée">Payée</option>
                <option value="en_attente">En attente</option>
                <option value="annulée">Annulée</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 font-semibold">Total HT</label>
              <input type="number" name="prix_ht" value={form.prix_ht || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Total TTC</label>
              <input type="number" name="prix_ttc" value={form.prix_ttc || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Note</label>
              <textarea name="note" value={form.note || ""} onChange={handleChange} className="w-full border p-3 rounded" />
            </div>
          </div>
        </div>
        {error && <div className="text-red-500 font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer la facture"}
        </button>
      </form>
    </div>
  );
}
