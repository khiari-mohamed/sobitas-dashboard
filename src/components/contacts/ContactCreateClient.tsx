"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/services/clients";
import { Client } from "@/types/client";

const initialForm: Omit<Client, "_id" | "created_at" | "updated_at"> = {
  name: "",
  email: "",
  phone_1: "",
  ville: "",
  adresse: "",
  subscriber: false,
};

export default function ContactCreateClient() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createClient(form);
      router.push("/admin/clients");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création du client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-screen-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Créer un client</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            required
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            required
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Téléphone</label>
          <input
            type="text"
            name="phone_1"
            value={form.phone_1 || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Ville</label>
          <input
            type="text"
            name="ville"
            value={form.ville || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Adresse</label>
          <input
            type="text"
            name="adresse"
            value={form.adresse || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="flex items-center text-lg font-semibold">
            <input
              type="checkbox"
              name="subscriber"
              checked={form.subscriber || false}
              onChange={(e) => setForm({ ...form, subscriber: e.target.checked })}
              className="mr-2"
            />
            Abonné
          </label>
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Création..." : "Créer le client"}
        </button>
      </form>
    </div>
  );
}
