"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createFaq, getNextFaqId } from "@/services/faq";
import { FAQ } from "@/types/faq";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function FaqsCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<{
    _id?: string;
    id: string;
    question: string;
    answer: string;
    created_at?: string;
    updated_at?: string;
  }>({
    id: "",
    question: "",
    answer: "",
    _id: undefined,
    created_at: undefined,
    updated_at: undefined,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    getNextFaqId().then(id => setForm(f => ({ ...f, id }))).catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createFaq(form);
      router.push("/admin/faqs");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création de la FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter une nouvelle FAQ</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ID (readonly, auto-generated) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID (auto)</label>
          <input
            type="text"
            name="id"
            value={form.id}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* _id (hidden, backend generated) */}
        <input type="hidden" name="_id" value={form._id || ""} />
        {/* Question */}
        <div className="mb-6 col-span-1 md:col-span-2">
          <label className="block text-xl font-semibold mb-2">Question</label>
          <input
            type="text"
            name="question"
            value={form.question}
            onChange={handleChange}
            className="w-full border p-4 text-base"
            required
          />
        </div>
        {/* Answer */}
        <div className="mb-6 col-span-1 md:col-span-2">
          <RichTextEditor
            value={form.answer}
            onChange={(value: string) => setForm({ ...form, answer: value })}
            label="Réponse"
          />
        </div>
        {/* created_at (readonly, backend generated) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input
            type="text"
            name="created_at"
            value={form.created_at ? new Date(form.created_at).toLocaleString() : "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {/* updated_at (readonly, backend generated) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input
            type="text"
            name="updated_at"
            value={form.updated_at ? new Date(form.updated_at).toLocaleString() : "—"}
            readOnly
            className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed"
          />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none"
            disabled={loading}
          >
            {loading ? "Création..." : "Créer la FAQ"}
          </button>
        </div>
      </form>
    </div>
  );
}
