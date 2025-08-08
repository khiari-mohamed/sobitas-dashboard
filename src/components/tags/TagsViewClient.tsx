"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchTagById } from "@/services/tags";
import { Tag } from "@/types/tags";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

export default function TagsViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [tag, setTag] = useState<Tag | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTagById(id)
      .then(setTag)
      .catch(() => setError("Tag introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !tag) return <div className="text-center py-12 text-red-500">{error || "Tag introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/tags/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/tags")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
       <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{tag.id}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{tag.designation_fr}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{tag.created_at ? new Date(tag.created_at).toLocaleString() : "—"}</div>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <div className="w-full border p-4 text-base bg-gray-100 rounded">{tag.updated_at ? new Date(tag.updated_at).toLocaleString() : "—"}</div>
        </div>
      </div>
    </div>
  );
}
