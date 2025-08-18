"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPageById, updatePage } from "@/services/page";
import { Page } from "@/types/page";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function PagesEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Page>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPageById(id)
      .then((page) => setForm(page))
      .catch(() => setError("Page introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cleanData = Object.fromEntries(
        Object.entries(form).filter(([key, value]) => 
          value !== undefined && value !== '' && key !== '_id' && key !== 'createdAt' && key !== 'updatedAt'
        )
      );
      await updatePage(id, cleanData);
      router.push("/admin/pages");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la modification de la page");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier la page</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Title */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Titre</label>
          <input
            type="text"
            name="title"
            value={form.title || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        {/* Slug */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Slug</label>
          <input
            type="text"
            name="slug"
            value={form.slug || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        {/* Excerpt */}
        <div className="mb-6 col-span-1 md:col-span-2">
          <label className="block text-xl font-semibold mb-2">Résumé</label>
          <textarea
            name="excerpt"
            value={form.excerpt || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            rows={3}
          />
        </div>
        {/* Body */}
        <div className="mb-6 col-span-1 md:col-span-2">
      
          <RichTextEditor
            value={form.body || ""}
            onChange={(value: string) => setForm({ ...form, body: value })}
            label="Contenu"
          />
        </div>
        {/* Meta Description */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Meta Description</label>
          <input
            type="text"
            name="meta_description"
            value={form.meta_description || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        {/* Meta Keywords */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Meta Keywords</label>
          <input
            type="text"
            name="meta_keywords"
            value={form.meta_keywords || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        {/* Author ID */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Auteur (ID)</label>
          <input
            type="text"
            name="author_id"
            value={form.author_id || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        {/* Image */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Image (URL)</label>
          <input
            type="text"
            name="image"
            value={form.image || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        {/* Status */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Statut</label>
          <select
            name="status"
            value={form.status || "ACTIVE"}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>
        {/* createdAt (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input
            type="text"
            value={form.createdAt ? new Date(form.createdAt).toLocaleString() : "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* updatedAt (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input
            type="text"
            value={form.updatedAt ? new Date(form.updatedAt).toLocaleString() : "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl border-none"
            disabled={loading}
          >
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
