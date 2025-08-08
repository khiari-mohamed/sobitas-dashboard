"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchClients } from "@/services/clients";
import { Client } from "@/types/client";
import Link from "next/link";
import { FaEdit, FaArrowLeft } from "react-icons/fa";

export default function ClientsViewClient({ id }: { id: string }) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchClients().then((clients) => {
      setClient(clients.find((c) => c._id === id) || null);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!client) {
    return <div className="text-center py-12 text-red-500">Aucun client trouvé.</div>;
  }

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link
          href={`/admin/clients/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </Link>
        <Link
          href="/admin/clients"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </Link>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Détails du client</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Nom</span>
          <span className="text-lg">{client.name}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Email</span>
          <span className="text-lg">{client.email}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Téléphone</span>
          <span className="text-lg">{client.phone_1}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Adresse</span>
          <span className="text-lg">{client.adresse}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Ville</span>
          <span className="text-lg">{client.ville}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Matricule</span>
          <span className="text-lg">{client.matricule ?? "—"}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Abonné</span>
          <span className="text-lg">{client.subscriber ? "Oui" : "Non"}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Créé le</span>
          <span className="text-lg">{client.created_at || "—"}</span>
        </div>
        <div className="border p-6">
          <span className="block text-xl font-semibold mb-2">Modifié le</span>
          <span className="text-lg">{client.updated_at || "—"}</span>
        </div>
      </div>
    </div>
  );
}
