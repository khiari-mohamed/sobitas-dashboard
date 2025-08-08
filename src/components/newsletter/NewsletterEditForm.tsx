"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchNewsletterById, updateNewsletter } from "@/services/newsletter";
import { Newsletter } from "@/types/newsletter-subscriber";

const initialState: Partial<Newsletter> = {
  id: "",
  email: "",
  created_at: "",
  updated_at: ""
};

export default function NewsletterEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Newsletter>>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchNewsletterById(id)
      .then((newsletter) => setForm(newsletter))
      .catch(() => setError("Abonné introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateNewsletter(id, form);
      router.push("/admin/newsletter");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la modification de l'abonné");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier l'abonné à la newsletter</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        {/* ID (readonly) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID</h2>
          <input type="text" name="id" value={form.id || ""} readOnly className="w-full border p-4 text-lg bg-gray-100 cursor-not-allowed" />
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
          <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
