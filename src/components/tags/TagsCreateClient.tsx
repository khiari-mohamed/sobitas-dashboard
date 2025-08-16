"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createTag } from "@/services/tags";
import { Tag } from "@/types/tags";

const initialState: Partial<Tag> = {
  id: "",
  designation_fr: "",
  created_at: "",
  updated_at: ""
};

export default function TagsCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Tag>>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createTag(form as Tag);
      router.push("/admin/tags");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du tag");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un nouveau tag</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        {/* ID */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <input type="text" name="id" value={form.id || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Désignation */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input type="text" name="designation_fr" value={form.designation_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* created_at (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input type="text" name="created_at" value={form.created_at ? new Date(form.created_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {/* updated_at (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input type="text" name="updated_at" value={form.updated_at ? new Date(form.updated_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1">
          <button type="submit" className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Création..." : "Créer le tag"}
          </button>
        </div>
      </form>
    </div>
  );
}
