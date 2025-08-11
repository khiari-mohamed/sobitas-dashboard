"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createAroma } from "@/services/aroma";
import { Button } from "@/components/ui/button";

export default function AromaCreateClient() {
  const [form, setForm] = useState({ id: "", designation_fr: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await createAroma(form);
    setLoading(false);
    router.push("/admin/aromas");
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-screen-2xl mx-auto">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un arôme</h1>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Custom ID</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.id}
            onChange={e => setForm({ ...form, id: e.target.value })}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Designation</label>
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
          Ajouter
        </button>
      </form>
    </div>
  );
}
