"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchFaqById, deleteFaq } from "@/services/faq";
import { FAQ } from "@/types/faq";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";

export default function FaqsViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [faq, setFaq] = useState<FAQ | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFaqById(id)
      .then(setFaq)
      .catch(() => setError("FAQ introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    setShowDelete(false);
    if (!faq) return;
    await deleteFaq(faq._id);
    router.push("/admin/faqs");
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !faq) return <div className="text-center py-12 text-red-500">{error || "FAQ introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/faqs/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaTrash /> Supprimer
        </button>
        <button
          onClick={() => router.push("/admin/faqs")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={faq.question}
      />
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* _id */}
          <div className="mb-6">
            <label className="block text-xl font-semibold mb-2">_id</label>
            <input
              type="text"
              value={faq._id}
              readOnly
              className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
            />
          </div>
          {/* id */}
          <div className="mb-6">
            <label className="block text-xl font-semibold mb-2">ID</label>
            <input
              type="text"
              value={faq.id}
              readOnly
              className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
            />
          </div>
          {/* Question */}
          <div className="mb-6 col-span-1 md:col-span-2">
            <label className="block text-xl font-semibold mb-2">Question</label>
            <input
              type="text"
              value={faq.question}
              readOnly
              className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
            />
          </div>
          {/* Answer */}
          <div className="mb-6 col-span-1 md:col-span-2">
            <label className="block text-xl font-semibold mb-2">Réponse</label>
            <div className="w-full border p-4 text-base bg-gray-50 min-h-[120px]" dangerouslySetInnerHTML={{ __html: faq.answer }} />
          </div>
          {/* created_at */}
          <div className="mb-6">
            <label className="block text-xl font-semibold mb-2">Date de création</label>
            <input
              type="text"
              value={faq.created_at ? new Date(faq.created_at).toLocaleString() : "—"}
              readOnly
              className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
            />
          </div>
          {/* updated_at */}
          <div className="mb-6">
            <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
            <input
              type="text"
              value={faq.updated_at ? new Date(faq.updated_at).toLocaleString() : "—"}
              readOnly
              className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
