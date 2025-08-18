"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import systemMessagesService from "@/services/system-messages";
import { SystemMessage } from "@/types/system-messages";

export default function SMSEditForm() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [form, setForm] = useState<SystemMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    systemMessagesService.fetchSystemMessageById(id)
      .then(setForm)
      .catch(() => setError("Message introuvable."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!form) return;
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError(null);
    try {
      await systemMessagesService.updateSystemMessage(id, {
        msg_welcome: form.msg_welcome,
        msg_etat_commande: form.msg_etat_commande,
        msg_passez_commande: form.msg_passez_commande,
      });
      router.push("/admin/sms");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Erreur lors de la modification du message.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;
  if (!form) return null;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier le message système (SMS)</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">ID</label>
          <input
            type="text"
            name="id"
            value={form.id}
            disabled
            className="w-full border p-4 bg-gray-100 cursor-not-allowed"
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Message de bienvenue</label>
          <textarea
            name="msg_welcome"
            value={form.msg_welcome}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            rows={3}
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Message état commande</label>
          <textarea
            name="msg_etat_commande"
            value={form.msg_etat_commande}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            rows={3}
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Message passez commande</label>
          <textarea
            name="msg_passez_commande"
            value={form.msg_passez_commande}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            rows={3}
          />
        </div>
        {error && <div className="text-red-600 font-semibold">{error}</div>}
        <button
          type="submit"
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl disabled:opacity-50"
          disabled={saving}
        >
          {saving ? "Enregistrement..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}
