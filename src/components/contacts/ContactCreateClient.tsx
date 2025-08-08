"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import contactsService from "@/services/contacts";
import { Contact } from "@/types/contacts";

const initialForm: Omit<Contact, "_id" | "created_at" | "updated_at"> = {
  id: "",
  name: "",
  email: "",
  message: "",
};

export default function ContactCreateClient() {
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
      await contactsService.createContact(form);
      router.push("/admin/contact");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Erreur lors de la création du contact.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Créer un contact</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="p-6 bg-gray-50 border">
          <label className="block text-lg font-semibold mb-2">ID</label>
          <input
            type="text"
            name="id"
            value={form.id}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            required
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
          disabled={loading}
        >
          {loading ? "Création..." : "Créer le contact"}
        </button>
      </form>
    </div>
  );
}
