"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createService } from "@/services/services";
import { ServiceItem } from "@/types/services";
import RichTextEditor from "@/components/ui/RichTextEditor";

const initialState: Partial<ServiceItem> = {
  id: "",
  designation_fr: "",
  description_fr: "",
  icon: "",
  created_at: "",
  updated_at: ""
};

export default function ServicesCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<any>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const iconInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, icon: file });
      const reader = new FileReader();
      reader.onload = () => {
        setIconPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createService(form as ServiceItem);
      router.push("/admin/services");
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création du service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un nouveau service</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ID */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ID</h2>
          <input type="text" name="id" value={form.id || ""} onChange={handleChange} className="w-full border p-4 text-lg" />
        </div>
        {/* Désignation */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Désignation</h2>
          <input type="text" name="designation_fr" value={form.designation_fr || ""} onChange={handleChange} className="w-full border p-4 text-lg" />
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
        {/* Icon (upload + preview) */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Icone</h2>
          <input
            type="file"
            accept="image/*"
            ref={iconInputRef}
            onChange={handleIconChange}
            className="w-full border p-2 text-base"
          />
          {iconPreview && (
            <img src={iconPreview} alt="icon preview" className="mt-2 border rounded" style={{ width: 100, height: 100, objectFit: 'contain' }} />
          )}
          <div className="text-xs text-gray-500 mt-1">{form.icon ? (typeof form.icon === "string" ? form.icon.split("/").pop() : "") : ""}</div>
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
          <button type="submit" className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Création..." : "Créer le service"}
          </button>
        </div>
      </form>
    </div>
  );
}
