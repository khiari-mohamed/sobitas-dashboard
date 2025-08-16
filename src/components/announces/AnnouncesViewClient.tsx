"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAnnonceById } from "@/services/annonces";
import { Annonce } from "@/types/annonces";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

export default function AnnouncesViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [annonce, setAnnonce] = useState<Annonce | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnnonceById(id)
      .then(setAnnonce)
      .catch(() => setError("Annonce introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !annonce) return <div className="text-center py-12 text-red-500">{error || "Annonce introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/announces/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/announces")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{annonce.id}</div>
        </div>
        {[1,2,3,4,5,6].map(n => (
          <React.Fragment key={n}>
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-2">Image {n}</label>
              {annonce[`image_${n}` as keyof Annonce] ? (
                <img src={(annonce[`image_${n}` as keyof Annonce] as string).startsWith('/') ? (annonce[`image_${n}` as keyof Annonce] as string) : `/${annonce[`image_${n}` as keyof Annonce]}`} alt={`img${n}`} width={200} height={100} className="object-contain border rounded" />
              ) : <div className="w-full border p-4 text-base bg-gray-100 rounded">—</div>}
            </div>
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-2">Lien {n}</label>
              {annonce[`link_img_${n}` as keyof Annonce] ? (
                <a href={annonce[`link_img_${n}` as keyof Annonce] as string} target="_blank" rel="noopener noreferrer" className="underline text-blue-600">{annonce[`link_img_${n}` as keyof Annonce]}</a>
              ) : <div className="w-full border p-4 text-base bg-gray-100 rounded">—</div>}
            </div>
          </React.Fragment>
        ))}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Default Cover</label>
          {annonce.products_default_cover ? (
            <img src={annonce.products_default_cover.startsWith('/') ? annonce.products_default_cover : `/${annonce.products_default_cover}`} alt="default cover" width={200} height={100} className="object-contain border rounded" />
          ) : <div className="w-full border p-4 text-base bg-gray-100 rounded">—</div>}
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{annonce.created_at ? new Date(annonce.created_at).toLocaleString() : "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{annonce.updated_at ? new Date(annonce.updated_at).toLocaleString() : "—"}</div>
        </div>
      </div>
    </div>
  );
}
