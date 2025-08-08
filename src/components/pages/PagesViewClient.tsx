"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchPageById } from "@/services/page";
import { Page } from "@/types/page";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

export default function PagesViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPageById(id)
      .then(setPage)
      .catch(() => setError("Page introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !page) return <div className="text-center py-12 text-red-500">{error || "Page introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/pages/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/pages")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        {/* _id */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">_id</label>
          <input
            type="text"
            value={page._id}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Title */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Titre</label>
          <input
            type="text"
            value={page.title}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Slug */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Slug</label>
          <input
            type="text"
            value={page.slug}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Status */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Statut</label>
          <input
            type="text"
            value={page.status}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Author ID */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Auteur (ID)</label>
          <input
            type="text"
            value={page.author_id || "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Image */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Image (URL)</label>
          <input
            type="text"
            value={page.image || "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Excerpt */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Résumé</label>
          <textarea
            value={page.excerpt || "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
            rows={3}
          />
        </div>
        {/* Meta Description */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Meta Description</label>
          <input
            type="text"
            value={page.meta_description || "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Meta Keywords */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Meta Keywords</label>
          <input
            type="text"
            value={page.meta_keywords || "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* createdAt */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input
            type="text"
            value={page.createdAt ? new Date(page.createdAt).toLocaleString() : "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* updatedAt */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input
            type="text"
            value={page.updatedAt ? new Date(page.updatedAt).toLocaleString() : "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* Body */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Contenu</label>
          <div className="w-full border p-4 text-base bg-gray-50 min-h-[120px]" dangerouslySetInnerHTML={{ __html: page.body }} />
        </div>
      </div>
    </div>
  );
}
