"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchServiceById } from "@/services/services";
import { ServiceItem } from "@/types/services";
import { FaEdit, FaArrowLeft } from "react-icons/fa";
import { getServicesImageWithFallback } from "@/utils/imageUtils";

export default function ServicesViewClient({ id }: { id: string }) {
  const router = useRouter();
  const [service, setService] = useState<ServiceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchServiceById(id)
      .then(setService)
      .catch(() => setError("Service introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error || !service) return <div className="text-center py-12 text-red-500">{error || "Service introuvable"}</div>;

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          onClick={() => router.push(`/admin/services/${id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </button>
        <button
          onClick={() => router.push("/admin/services")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <div className="bg-white shadow-lg p-10 w-full max-w-[1600px] mx-auto border">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{service.id}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Désignation</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{service.designation_fr}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Description</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded whitespace-pre-line">{service.description_fr}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Icone</h2>
          {service.icon ? (
            <img 
              src={(() => {
                const { src } = getServicesImageWithFallback(service as unknown as Record<string, unknown>);
                return src;
              })()} 
              alt="icon" 
              width={120} 
              height={120} 
              className="object-contain border rounded"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const { fallback } = getServicesImageWithFallback(service as unknown as Record<string, unknown>);
                if (fallback && target.src !== fallback) {
                  target.src = fallback;
                } else {
                  target.src = "/images/placeholder.png";
                }
              }}
            />
          ) : <div className="w-full border p-4 text-lg bg-gray-100 rounded">—</div>}
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de création</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{service.created_at ? new Date(service.created_at).toLocaleString() : "—"}</div>
        </div>
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de mise à jour</h2>
          <div className="w-full border p-4 text-lg bg-gray-100 rounded">{service.updated_at ? new Date(service.updated_at).toLocaleString() : "—"}</div>
        </div>
      </div>
    </div>
  );
}
