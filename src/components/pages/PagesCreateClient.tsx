"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createPage } from "@/services/page";
import { Page } from "@/types/page";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function PagesCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Page>>({
    title: "",
    slug: "",
    body: "",
    excerpt: "",
    meta_description: "",
    meta_keywords: "",
    author_id: "",
    image: "",
    status: "ACTIVE",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const cleanData = Object.fromEntries(
        Object.entries(form).filter(([_, value]) => value !== undefined && value !== '')
      );
      await createPage(cleanData);
      router.push("/admin/pages");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la page");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter une nouvelle page</h1>
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
          <RichTextEditor
            value={form.excerpt || ""}
            onChange={(value: string) => setForm({ ...form, excerpt: value })}
            label="Résumé"
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
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer la page"}
          </button>
        </div>
      </form>
    </div>
  );
}
