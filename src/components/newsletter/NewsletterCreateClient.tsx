"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createNewsletter } from "@/services/newsletter";
import { Newsletter } from "@/types/newsletter-subscriber";

const initialState: Partial<Newsletter> = {
  id: "",
  email: "",
  created_at: "",
  updated_at: ""
};

export default function NewsletterCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Newsletter>>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createNewsletter(form as Newsletter);
      router.push("/admin/newsletter");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de l'abonné");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un nouvel abonné à la newsletter</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        {/* ID */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID</h2>
          <input type="text" name="id" value={form.id || ""} onChange={handleChange} className="w-full border p-4 text-lg" required />
        </div>
        {/* Email */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Email</h2>
          <input type="email" name="email" value={form.email || ""} onChange={handleChange} className="w-full border p-4 text-lg" required />
        </div>
        {/* created_at (readonly) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de création</h2>
          <input type="text" name="created_at" value={form.created_at ? new Date(form.created_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-lg bg-gray-100 cursor-not-allowed" />
        </div>
        {/* updated_at (readonly) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Date de mise à jour</h2>
          <input type="text" name="updated_at" value={form.updated_at ? new Date(form.updated_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-lg bg-gray-100 cursor-not-allowed" />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1">
          <button type="submit" className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Création..." : "Ajouter l'abonné"}
          </button>
        </div>
      </form>
    </div>
  );
}
