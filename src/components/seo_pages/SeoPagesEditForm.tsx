"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchSeoPageById, updateSeoPage } from "@/services/seo-pages";
import { SeoPage } from "@/types/seo-pages";
import RichTextEditor from "@/components/ui/RichTextEditor";

const initialState: Partial<SeoPage> = {
  id: "",
  page: "",
  meta: "",
  description_fr: "",
  nutrition_values: "",
  questions: "",
  zone1: "",
  zone2: "",
  zone3: "",
  more_details: "",
  created_at: "",
  updated_at: ""
};

export default function SeoPagesEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<SeoPage>>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSeoPageById(id)
      .then((seoPage) => setForm(seoPage))
      .catch(() => setError("Page SEO introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await updateSeoPage(id, form);
      router.push("/admin/seo_pages");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la modification de la page SEO");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier la page SEO</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ID (readonly) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID</h2>
          <input type="text" name="id" value={form.id || ""} readOnly className="w-full border p-4 text-lg bg-gray-100 cursor-not-allowed" />
        </div>
        {/* Page */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Page</h2>
          <input type="text" name="page" value={form.page || ""} onChange={handleChange} className="w-full border p-4 text-lg" required />
        </div>
        {/* Meta */}
        <div className="mb-10 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Meta ( name;content/name;content/name;content...)</h2>
          <textarea name="meta" value={form.meta || ""} onChange={handleChange} className="w-full border p-4 text-lg whitespace-pre-line" rows={2} />
        </div>
        {/* Description (RichTextEditor) */}
        <div className="mb-10 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Description</h2>
          <RichTextEditor
            value={form.description_fr || ""}
            onChange={value => setForm({ ...form, description_fr: value })}
            label=""
          />
        </div>
        {/* Nutrition Values (RichTextEditor) */}
        <div className="mb-10 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Valeurs nutritionnelles</h2>
          <RichTextEditor
            value={form.nutrition_values || ""}
            onChange={value => setForm({ ...form, nutrition_values: value })}
            label=""
          />
        </div>
        {/* Questions (RichTextEditor) */}
        <div className="mb-10 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Questions</h2>
          <RichTextEditor
            value={form.questions || ""}
            onChange={value => setForm({ ...form, questions: value })}
            label=""
          />
        </div>
        {/* Zone 1 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zone 1</h2>
          <input type="text" name="zone1" value={form.zone1 || ""} onChange={handleChange} className="w-full border p-4 text-lg" />
        </div>
        {/* Zone 2 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zone 2</h2>
          <input type="text" name="zone2" value={form.zone2 || ""} onChange={handleChange} className="w-full border p-4 text-lg" />
        </div>
        {/* Zone 3 */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zone 3</h2>
          <input type="text" name="zone3" value={form.zone3 || ""} onChange={handleChange} className="w-full border p-4 text-lg" />
        </div>
        {/* More Details (RichTextEditor) */}
        <div className="mb-10 col-span-1 md:col-span-2">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Plus de détails</h2>
          <RichTextEditor
            value={form.more_details || ""}
            onChange={value => setForm({ ...form, more_details: value })}
            label=""
          />
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
        <div className="col-span-1 md:col-span-2">
          <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
