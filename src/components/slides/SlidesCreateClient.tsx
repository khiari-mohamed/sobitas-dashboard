"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createSlide } from "@/services/slides";
import { Slide } from "@/types/slides";

interface SlideFormState extends Omit<Slide, 'cover'> {
  cover: string | File;
}

const initialState: Partial<SlideFormState> = {
  id: "",
  cover: "",
  designation_fr: "",
  description_fr: "",
  btn_text_fr: "",
  btn_link: "",
  created_at: "",
  updated_at: "",
  position: "",
  text_color: "",
  text_weight: "",
  type: ""
};

export default function SlidesCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<SlideFormState>>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, cover: file });
      const reader = new FileReader();
      reader.onload = () => {
        setCoverPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // You may need to handle file upload as multipart/form-data if backend expects it
      await createSlide(form as Slide);
      router.push("/admin/slides");
    } catch (err: unknown) {
      setError((err as Error).message || "Erreur lors de la création du slide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un nouveau slide</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ID */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <input type="text" name="id" value={form.id || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Cover (upload + preview) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Image (cover)</label>
          <input
            type="file"
            accept="image/*"
            ref={coverInputRef}
            onChange={handleCoverChange}
            className="w-full border p-2 text-base"
          />
          {coverPreview && (
            <img src={coverPreview} alt="cover preview" className="mt-2 border rounded" style={{ width: 200, height: 100, objectFit: 'contain' }} />
          )}
        </div>
        {/* Designation */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input type="text" name="designation_fr" value={form.designation_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Description */}
        <div className="mb-6 col-span-1 md:col-span-2">
          <label className="block text-xl font-semibold mb-2">Description</label>
          <textarea name="description_fr" value={form.description_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" rows={3} />
        </div>
        {/* Button Text */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Texte du bouton</label>
          <input type="text" name="btn_text_fr" value={form.btn_text_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Button Link */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Lien du bouton</label>
          <input type="text" name="btn_link" value={form.btn_link || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Position */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Position</label>
          <input type="text" name="position" value={form.position || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Text Color */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Text Color</label>
          <input type="text" name="text_color" value={form.text_color || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Text Weight */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Text Weight</label>
          <input type="text" name="text_weight" value={form.text_weight || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* Type */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Type</label>
          <input type="text" name="type" value={form.type || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        {/* created_at (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input type="text" name="created_at" value={form.created_at ? new Date(form.created_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {/* updated_at (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input type="text" name="updated_at" value={form.updated_at ? new Date(form.updated_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1 md:col-span-2">
          <button type="submit" className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Création..." : "Créer le slide"}
          </button>
        </div>
      </form>
    </div>
  );
}
