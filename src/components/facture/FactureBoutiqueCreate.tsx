"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import factureService from "@/services/facture";

interface FactureItem {
  designation: string;
  quantity: number;
  prix_unitaire: number;
  total: number;
}

export default function FactureBoutiqueCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<FactureItem[]>([
    { designation: "", quantity: 1, prix_unitaire: 0, total: 0 }
  ]);
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    prenom: "",
    email: "",
    phone: "",
    adresse: "",
    ville: "",
    pays: "Tunisie"
  });
  const [livraisonInfo, setLivraisonInfo] = useState({
    nom: "",
    prenom: "",
    adresse1: "",
    adresse2: "",
    ville: "",
    code_postale: "",
    pays: "Tunisie",
    phone: ""
  });
  const [factureInfo, setFactureInfo] = useState({
    numero: "",
    note: ""
  });

  const addItem = () => {
    setItems([...items, { designation: "", quantity: 1, prix_unitaire: 0, total: 0 }]);
  };

  const updateItem = (index: number, field: keyof FactureItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    if (field === 'quantity' || field === 'prix_unitaire') {
      newItems[index].total = newItems[index].quantity * newItems[index].prix_unitaire;
    }
    
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const getTotalHT = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const getTVA = () => {
    return getTotalHT() * 0.19;
  };

  const getTimbre = () => {
    return 1.000;
  };

  const getTotalTTC = () => {
    return getTotalHT() + getTVA() + getTimbre();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const factureData = {
        type: 'facture_boutique',
        numero: factureInfo.numero || `FB-${Date.now()}`,
        nom: clientInfo.nom,
        prenom: clientInfo.prenom,
        email: clientInfo.email,
        phone: clientInfo.phone,
        adresse1: clientInfo.adresse,
        pays: clientInfo.pays,
        livraison_nom: livraisonInfo.nom,
        livraison_prenom: livraisonInfo.prenom,
        livraison_adresse1: livraisonInfo.adresse1,
        livraison_adresse2: livraisonInfo.adresse2,
        livraison_ville: livraisonInfo.ville,
        livraison_code_postale: livraisonInfo.code_postale,
        livraison_phone: livraisonInfo.phone,
        note: factureInfo.note,
        prix_ht: getTotalHT().toString(),
        tva: getTVA().toString(),
        timbre: getTimbre().toString(),
        prix_ttc: getTotalTTC().toString(),
        items: JSON.stringify(items),
        created_at: new Date().toISOString()
      };
      
      await factureService.createFacture(factureData);
      router.push("/admin/facture");
    } catch (error) {
      console.error('Error creating facture boutique:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-6xl mx-auto mt-6">
      <div className="text-center mb-8 border-b pb-6">
        <h1 className="text-3xl font-bold text-gray-800">FACTURE BOUTIQUE</h1>
        <p className="text-gray-600">SOBITAS - Protein.tn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">N° Facture</label>
            <input
              type="text"
              value={factureInfo.numero}
              onChange={(e) => setFactureInfo({...factureInfo, numero: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="Auto-généré si vide"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={new Date().toISOString().split('T')[0]}
              className="w-full border rounded px-3 py-2 bg-gray-50"
              readOnly
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Facturé à</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={clientInfo.nom}
                  onChange={(e) => setClientInfo({...clientInfo, nom: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  value={clientInfo.prenom}
                  onChange={(e) => setClientInfo({...clientInfo, prenom: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={clientInfo.email}
                  onChange={(e) => setClientInfo({...clientInfo, email: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="text"
                  value={clientInfo.phone}
                  onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse</label>
                <input
                  type="text"
                  value={clientInfo.adresse}
                  onChange={(e) => setClientInfo({...clientInfo, adresse: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pays</label>
                <input
                  type="text"
                  value={clientInfo.pays}
                  onChange={(e) => setClientInfo({...clientInfo, pays: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">Livraison</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input
                  type="text"
                  value={livraisonInfo.nom}
                  onChange={(e) => setLivraisonInfo({...livraisonInfo, nom: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input
                  type="text"
                  value={livraisonInfo.prenom}
                  onChange={(e) => setLivraisonInfo({...livraisonInfo, prenom: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse 1</label>
                <input
                  type="text"
                  value={livraisonInfo.adresse1}
                  onChange={(e) => setLivraisonInfo({...livraisonInfo, adresse1: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Adresse 2</label>
                <input
                  type="text"
                  value={livraisonInfo.adresse2}
                  onChange={(e) => setLivraisonInfo({...livraisonInfo, adresse2: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input
                  type="text"
                  value={livraisonInfo.ville}
                  onChange={(e) => setLivraisonInfo({...livraisonInfo, ville: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Code Postal</label>
                <input
                  type="text"
                  value={livraisonInfo.code_postale}
                  onChange={(e) => setLivraisonInfo({...livraisonInfo, code_postale: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Téléphone</label>
                <input
                  type="text"
                  value={livraisonInfo.phone}
                  onChange={(e) => setLivraisonInfo({...livraisonInfo, phone: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4 border-b pb-2">Articles</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">Désignation</th>
                  <th className="px-4 py-3 text-center">Quantité</th>
                  <th className="px-4 py-3 text-right">Prix Unitaire HT</th>
                  <th className="px-4 py-3 text-right">Total HT</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.designation}
                        onChange={(e) => updateItem(index, 'designation', e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Description du produit"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full border rounded px-3 py-2 text-center"
                        min="1"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        step="0.001"
                        value={item.prix_unitaire}
                        onChange={(e) => updateItem(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                        className="w-full border rounded px-3 py-2 text-right"
                      />
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {item.total.toFixed(3)} DT
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 px-2 py-1"
                        disabled={items.length === 1}
                      >
                        ✕
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + Ajouter Article
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Note / Observations</label>
          <textarea
            value={factureInfo.note}
            onChange={(e) => setFactureInfo({...factureInfo, note: e.target.value})}
            className="w-full border rounded px-3 py-2"
            rows={3}
            placeholder="Remarques particulières..."
          />
        </div>

        <div className="border-t pt-6">
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between">
                <span>Total HT:</span>
                <span className="font-medium">{getTotalHT().toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between">
                <span>TVA (19%):</span>
                <span className="font-medium">{getTVA().toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between">
                <span>Timbre:</span>
                <span className="font-medium">{getTimbre().toFixed(3)} DT</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2">
                <span>Total TTC:</span>
                <span>{getTotalTTC().toFixed(3)} DT</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-500 text-white py-3 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-purple-600 text-white py-3 rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer Facture Boutique"}
          </button>
        </div>
      </form>
    </div>
  );
}