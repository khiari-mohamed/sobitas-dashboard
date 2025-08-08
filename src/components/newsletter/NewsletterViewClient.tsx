"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchNewsletterById } from "@/services/newsletter";
import { Newsletter } from "@/types/newsletter-subscriber";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

export default function NewsletterViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsletterById(id)
      .then(setNewsletter)
      .catch(() => setError("Abonné introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !newsletter) return <div className="text-center py-12 text-red-500">{error || "Abonné introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/newsletter/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/newsletter")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{newsletter.id}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{newsletter.email}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de création</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{newsletter.created_at ? new Date(newsletter.created_at).toLocaleString() : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de mise à jour</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{newsletter.updated_at ? new Date(newsletter.updated_at).toLocaleString() : "—"}</div>
        </div>
      </div>
    </div>
  );
}
