"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import systemMessagesService from "@/services/system-messages";
import { SystemMessage } from "@/types/system-messages";

const initialForm: Omit<SystemMessage, "_id" | "created_at" | "updated_at"> = {
  id: "",
  msg_welcome: "",
  msg_etat_commande: "",
  msg_passez_commande: "",
};

export default function SMSCreateClient() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await systemMessagesService.createSystemMessage(form);
      router.push("/admin/sms");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Erreur lors de la création du message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Créer un message système (SMS)</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">ID</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            
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
          disabled={loading}
        >
          {loading ? "Création..." : "Créer le message"}
        </button>
      </form>
    </div>
  );
}
