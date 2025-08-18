"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAromaById } from "@/services/aroma";
import { FaEdit } from "react-icons/fa";

export default function AromaViewClient({ id }: { id: string }) {
  const [aroma, setAroma] = useState<{ id: string; designation_fr: string; created_at: string; updated_at: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getAromaById(id)
      .then(setAroma)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!aroma) {
    return <div className="text-center py-12 text-red-500">Aucun arôme trouvé.</div>;
  }

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-screen-2xl mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push(`/admin/aromas/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/aromas")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          Retourner à la liste
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Détails de l&apos;arôme</h1>
      <div className="mb-6">
        <span className="block text-xl font-semibold mb-2">ID</span>
        <span className="text-lg">{aroma.id}</span>
      </div>
      <div className="mb-6">
        <span className="block text-xl font-semibold mb-2">designation_fr</span>
        <span className="text-lg">{aroma.designation_fr}</span>
      </div>
      <div className="mb-6">
        <span className="block text-xl font-semibold mb-2">Créé le</span>
        <span className="text-lg">{aroma.created_at}</span>
      </div>
      <div className="mb-6">
        <span className="block text-xl font-semibold mb-2">Modifié le</span>
        <span className="text-lg">{aroma.updated_at}</span>
      </div>
    </div>
  );
}
