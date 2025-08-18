"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Client } from "@/types/client";
import { createClient } from "@/services/clients";

export default function ClientsCreateClient() {
  const [form, setForm] = useState<Partial<Client>>({
    name: "",
    email: "",
    phone_1: "",
    adresse: "",
    ville: "",
    subscriber: false,
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createClient(form);
      router.push("/admin/clients");
    } catch (err: unknown) {
      alert("Erreur lors de la création du client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/clients")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 flex items-center gap-2 text-base"
        >
          Retourner à la liste
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un client</h1>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            className="w-full border p-4 text-base"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border p-4 text-base"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Téléphone</label>
          <input
            type="text"
            name="phone_1"
            className="w-full border p-4 text-base"
            value={form.phone_1}
            onChange={e => setForm(f => ({ ...f, phone_1: e.target.value }))}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Adresse</label>
          <input
            type="text"
            name="adresse"
            className="w-full border p-4 text-base"
            value={form.adresse}
            onChange={e => setForm(f => ({ ...f, adresse: e.target.value }))}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Ville</label>
          <input
            type="text"
            name="ville"
            className="w-full border p-4 text-base"
            value={form.ville}
            onChange={e => setForm(f => ({ ...f, ville: e.target.value }))}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Matricule</label>
          <input
            type="text"
            name="matricule"
            className="w-full border p-4 text-base"
            value={form.matricule || ""}
            onChange={e => setForm(f => ({ ...f, matricule: e.target.value }))}
          />
        </div>
        <div className="mb-6 flex items-center gap-4">
          <label className="text-xl font-semibold">Abonné</label>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, subscriber: !f.subscriber }))}
            className={`px-6 py-2 font-bold text-white rounded transition-colors duration-200 ${form.subscriber ? 'bg-[#28a4f4]' : 'bg-gray-400'}`}
          >
            {form.subscriber ? 'Oui' : 'Non'}
          </button>
        </div>
        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl"
          disabled={loading}
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}
