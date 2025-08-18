"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClients, updateClient } from "@/services/clients";
import { Client } from "@/types/client";

export default function ClientsEditForm({ id }: { id: string }) {
  const [form, setForm] = useState<Partial<Client> | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setInitialLoading(true);
    fetchClients().then((clients) => {
      const client = clients.find((c) => c._id === id);
      setForm(client || {});
      setInitialLoading(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => prev ? { ...prev, [name]: checked } : null);
    } else {
      setForm((prev) => prev ? { ...prev, [name]: value } : null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setLoading(true);
    await updateClient(id, form);
    setLoading(false);
    router.push("/admin/clients");
  };

  if (initialLoading || !form) {
    return <div className="text-center py-12">Chargement...</div>;
  }

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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier le client</h1>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            className="w-full border p-4 text-base"
            value={form.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            className="w-full border p-4 text-base"
            value={form.email || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Téléphone</label>
          <input
            type="text"
            name="phone_1"
            className="w-full border p-4 text-base"
            value={form.phone_1 || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Adresse</label>
          <input
            type="text"
            name="adresse"
            className="w-full border p-4 text-base"
            value={form.adresse || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Ville</label>
          <input
            type="text"
            name="ville"
            className="w-full border p-4 text-base"
            value={form.ville || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Matricule</label>
          <input
            type="text"
            name="matricule"
            className="w-full border p-4 text-base"
            value={form.matricule || ""}
            onChange={handleChange}
          />
        </div>
        <div className="mb-6 flex items-center gap-4">
          <label className="text-xl font-semibold">Abonné</label>
          <button
            type="button"
            onClick={() => setForm(f => f ? { ...f, subscriber: !f.subscriber } : f)}
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
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
