"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSeoPageById } from "@/services/seo-pages";
import { SeoPage } from "@/types/seo-pages";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

export default function SeoPagesViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [seoPage, setSeoPage] = useState<SeoPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeoPageById(id)
      .then(setSeoPage)
      .catch(() => setError("Page SEO introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !seoPage) return <div className="text-center py-12 text-red-500">{error || "Page SEO introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/seo_pages/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/seo_pages")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{seoPage.id}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Page</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{seoPage.page}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Meta ( name;content/name;content/name;content...)</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.meta || "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Description</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.description_fr ? seoPage.description_fr.replace(/<[^>]+>/g, "") : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Valeurs nutritionnelles</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.nutrition_values ? seoPage.nutrition_values.replace(/<[^>]+>/g, "") : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Questions</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.questions ? seoPage.questions.replace(/<[^>]+>/g, "") : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zone 1</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.zone1 ? seoPage.zone1.replace(/<[^>]+>/g, "") : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zone 2</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.zone2 ? seoPage.zone2.replace(/<[^>]+>/g, "") : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zone 3</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.zone3 ? seoPage.zone3.replace(/<[^>]+>/g, "") : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Plus de détails</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{seoPage.more_details ? seoPage.more_details.replace(/<[^>]+>/g, "") : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de création</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{seoPage.created_at ? new Date(seoPage.created_at).toLocaleString() : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de mise à jour</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{seoPage.updated_at ? new Date(seoPage.updated_at).toLocaleString() : "—"}</div>
        </div>
      </div>
    </div>
  );
}
