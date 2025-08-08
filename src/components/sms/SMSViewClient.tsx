"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import systemMessagesService from "@/services/system-messages";
import { SystemMessage } from "@/types/system-messages";

export default function SMSViewClient() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [message, setMessage] = useState<SystemMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    systemMessagesService.fetchSystemMessageById(id)
      .then(setMessage)
      .catch(() => setError("Message introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;
  if (!message) return null;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/sms")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          ← Retourner à la liste
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/sms/${message.id}/edit`)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          ✏️ Éditer
        </button>
      </div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Détails du message système (SMS)</h1>
      <div className="space-y-6">
        <div className="p-6 bg-gray-50 border">
          <div className="text-lg font-semibold text-gray-700 mb-1">MongoDB _id</div>
          <div className="text-base text-gray-900 break-all">{message._id}</div>
        </div>
        <div className="p-6 bg-gray-50 border">
          <div className="text-lg font-semibold text-gray-700 mb-1">ID</div>
          <div className="text-base text-gray-900">{message.id}</div>
        </div>
        <div className="p-6 bg-gray-50 border">
          <div className="text-lg font-semibold text-gray-700 mb-1">Message de bienvenue</div>
          <div className="text-base text-gray-900 whitespace-pre-line">{message.msg_welcome}</div>
        </div>
        <div className="p-6 bg-gray-50 border">
          <div className="text-lg font-semibold text-gray-700 mb-1">Message état commande</div>
          <div className="text-base text-gray-900 whitespace-pre-line">{message.msg_etat_commande}</div>
        </div>
        <div className="p-6 bg-gray-50 border">
          <div className="text-lg font-semibold text-gray-700 mb-1">Message passez commande</div>
          <div className="text-base text-gray-900 whitespace-pre-line">{message.msg_passez_commande}</div>
        </div>
        <div className="p-6 bg-gray-50 border">
          <div className="text-lg font-semibold text-gray-700 mb-1">Date de création</div>
          <div className="text-base text-gray-900">{message.created_at ? new Date(message.created_at).toLocaleString() : '—'}</div>
        </div>
        <div className="p-6 bg-gray-50 border">
          <div className="text-lg font-semibold text-gray-700 mb-1">Date de modification</div>
          <div className="text-base text-gray-900">{message.updated_at ? new Date(message.updated_at).toLocaleString() : '—'}</div>
        </div>
      </div>
    </div>
  );
}
