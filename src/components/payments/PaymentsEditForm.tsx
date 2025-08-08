"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createPayment } from "@/services/payments";
import { Payment } from "@/types/payments";

const initialState: Partial<Payment> = {
  orderId: "",
  amount: 0,
  status: "pending",
  paymentToken: "",
  createdAt: "",
  updatedAt: ""
};

export default function PaymentsEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Payment>>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ 
      ...form, 
      [name]: name === "amount" ? Number(value) : value 
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createPayment(form as Payment);
      router.push("/admin/payments");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du paiement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un nouveau paiement</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID Commande</label>
          <input 
            type="text" 
            name="orderId" 
            value={form.orderId || ""} 
            onChange={handleChange} 
            className="w-full border p-4 text-base" 
            required 
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Montant</label>
          <input 
            type="number" 
            name="amount" 
            value={form.amount || ""} 
            onChange={handleChange} 
            className="w-full border p-4 text-base" 
            required 
            step="0.01"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Statut</label>
          <select 
            name="status" 
            value={form.status || "pending"} 
            onChange={handleChange} 
            className="w-full border p-4 text-base" 
            required
          >
            <option value="pending">En attente</option>
            <option value="paid">Payé</option>
            <option value="failed">Échoué</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Token de paiement</label>
          <input 
            type="text" 
            name="paymentToken" 
            value={form.paymentToken || ""} 
            onChange={handleChange} 
            className="w-full border p-4 text-base" 
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input 
            type="text" 
            name="createdAt" 
            value={form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"} 
            readOnly 
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" 
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input 
            type="text" 
            name="updatedAt" 
            value={form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "—"} 
            readOnly 
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" 
          />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1">
          <button 
            type="submit" 
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none" 
            disabled={loading}
          >
            {loading ? "Création..." : "Créer le paiement"}
          </button>
        </div>
      </form>
    </div>
  );
}
