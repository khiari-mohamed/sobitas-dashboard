"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import contactsService from "@/services/contacts";
import { Contact } from "@/types/contacts";

export default function ContactEditForm() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : Array.isArray(params?.id) ? params.id[0] : "";

  const [form, setForm] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    contactsService.fetchContactById(id)
      .then(setForm)
      .catch(() => setError("Contact introuvable."))
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
      await contactsService.updateContact(id, {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      router.push("/admin/contact");
    } catch (err: unknown) {
      setError((err as Error)?.message || "Erreur lors de la modification du contact.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;
  if (error) return <div className="text-center text-red-600 py-12">{error}</div>;
  if (!form) return null;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier le contact</h1>
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
          <label className="block text-lg font-semibold mb-2">Nom</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            required
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            required
          />
        </div>
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">Message</label>
          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            rows={5}
            required
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
