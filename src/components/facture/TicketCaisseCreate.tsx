"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import factureService from "@/services/facture";

interface TicketItem {
  designation: string;
  quantity: number;
  prix_unitaire: number;
  total: number;
}

export default function TicketCaisseCreate() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<TicketItem[]>([
    { designation: "", quantity: 1, prix_unitaire: 0, total: 0 }
  ]);
  const [clientInfo, setClientInfo] = useState({
    nom: "",
    phone: ""
  });

  const addItem = () => {
    setItems([...items, { designation: "", quantity: 1, prix_unitaire: 0, total: 0 }]);
  };

  const updateItem = (index: number, field: keyof TicketItem, value: string | number) => {
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

  const getTotalTTC = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const ticketData = {
        type: 'ticket_caisse',
        numero: `TIC-${Date.now()}`,
        nom: clientInfo.nom,
        phone: clientInfo.phone,
        prix_ttc: getTotalTTC().toString(),
        items: JSON.stringify(items),
        created_at: new Date().toISOString()
      };
      
      await factureService.createFacture(ticketData);
      router.push("/admin/facture");
    } catch (error) {
      console.error('Error creating ticket:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">TICKET DE CAISSE</h1>
        <p className="text-sm text-gray-600">SOBITAS - Protein.tn</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Client Info - Minimal */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom Client</label>
            <input
              type="text"
              value={clientInfo.nom}
              onChange={(e) => setClientInfo({...clientInfo, nom: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="Nom du client"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="text"
              value={clientInfo.phone}
              onChange={(e) => setClientInfo({...clientInfo, phone: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="Numéro de téléphone"
            />
          </div>
        </div>

        {/* Items Table */}
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Désignation</th>
                <th className="px-4 py-2 text-center">Qté</th>
                <th className="px-4 py-2 text-right">Prix Unit.</th>
                <th className="px-4 py-2 text-right">Total</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">
                    <input
                      type="text"
                      value={item.designation}
                      onChange={(e) => updateItem(index, 'designation', e.target.value)}
                      className="w-full border rounded px-2 py-1"
                      placeholder="Nom du produit"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                      className="w-full border rounded px-2 py-1 text-center"
                      min="1"
                    />
                  </td>
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      step="0.001"
                      value={item.prix_unitaire}
                      onChange={(e) => updateItem(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                      className="w-full border rounded px-2 py-1 text-right"
                    />
                  </td>
                  <td className="px-4 py-2 text-right font-medium">
                    {item.total.toFixed(3)} DT
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-600 hover:text-red-800"
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
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Ajouter Article
        </button>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-end">
            <div className="text-right">
              <div className="text-xl font-bold">
                Total: {getTotalTTC().toFixed(3)} DT
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
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
            className="flex-1 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer Ticket"}
          </button>
        </div>
      </form>
    </div>
  );
}