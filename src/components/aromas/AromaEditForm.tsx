"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAromaById, updateAroma } from "@/services/aroma";
import { Button } from "@/components/ui/button";

export default function AromaEditForm({ id }: { id: string }) {
  const [form, setForm] = useState({ id: "", designation_fr: "" });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setInitialLoading(true);
    getAromaById(id)
      .then((aroma: { id: string; designation_fr: string }) => setForm({ id: aroma.id, designation_fr: aroma.designation_fr }))
      .finally(() => setInitialLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await updateAroma(id, form);
    setLoading(false);
    router.push("/admin/aromas");
  };

  if (initialLoading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[800px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/aromas")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          Retourner à la liste
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier l'arôme</h1>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.id}
            onChange={e => setForm({ ...form, id: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">designation_fr</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.designation_fr}
            onChange={e => setForm({ ...form, designation_fr: e.target.value })}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl"
          disabled={loading}
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
