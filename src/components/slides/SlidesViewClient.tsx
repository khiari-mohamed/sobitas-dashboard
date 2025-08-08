"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSlideById } from "@/services/slides";
import { Slide } from "@/types/slides";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

export default function SlidesViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [slide, setSlide] = useState<Slide | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSlideById(id)
      .then(setSlide)
      .catch(() => setError("Slide introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !slide) return <div className="text-center py-12 text-red-500">{error || "Slide introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/slides/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/slides")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.id}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Image (cover)</label>
          {slide.cover ? (
            <img src={`/${slide.cover}`} alt="cover" width={200} height={100} className="object-contain border rounded" />
          ) : <div className="w-full border p-4 text-base bg-gray-100 rounded">—</div>}
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.designation_fr || "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Description</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.description_fr || "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Texte du bouton</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.btn_text_fr || "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Lien du bouton</label>
          {slide.btn_link ? (
            <a href={slide.btn_link} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{slide.btn_link}</a>
          ) : <div className="w-full border p-4 text-base bg-gray-100 rounded">—</div>}
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Position</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.position || "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Type</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.type || "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Text Color</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.text_color || "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Text Weight</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.text_weight || "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.created_at ? new Date(slide.created_at).toLocaleString() : "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{slide.updated_at ? new Date(slide.updated_at).toLocaleString() : "—"}</div>
        </div>
      </div>
    </div>
  );
}
