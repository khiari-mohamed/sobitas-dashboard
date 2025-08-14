"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getBlogs, updateBlog } from "@/services/blog.service";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function BlogEditForm({ id }: { id: string }) {
  const [form, setForm] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    setInitialLoading(true);
    getBlogs().then((blogs) => {
      const blog = blogs.find((b) => b._id === id);
      setForm(blog);
      setInitialLoading(false);
    });
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev: any) => ({ ...prev, cover: file }));
  };

  // Compute preview URL for cover image (same logic as table)
  let coverPreview = "/images/placeholder.png";
  if (form?.cover) {
    if (form.cover instanceof File) {
      coverPreview = URL.createObjectURL(form.cover);
    } else if (typeof form.cover === "string" && form.cover.startsWith('/blogs/')) {
      // New uploaded images
      coverPreview = form.cover;
    } else if (typeof form.cover === "object" && form.cover?.url) {
      // Object format
      coverPreview = form.cover.url.startsWith("http") ? form.cover.url : form.cover.url;
    } else if (typeof form.cover === "string" && form.cover !== "") {
      // Old uploads format
      coverPreview = form.cover.startsWith('/') ? form.cover : `/uploads/${form.cover}`;
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { cover, ...blogData } = form;
      const imageFile = cover instanceof File ? cover : null;
      await updateBlog(id, blogData, imageFile);
      router.push("/admin/blogs");
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Erreur lors de la mise à jour du blog');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading || !form) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={() => router.push("/admin/blogs")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 flex items-center gap-2 text-base"
        >
          Retourner à la liste
        </button>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier le blog</h1>
        {/* Désignation */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input
            type="text"
            name="designation_fr"
            className="w-full border p-4 text-base"
            value={form.designation_fr || ""}
            onChange={handleChange}
            required
          />
        </div>
        {/* Couverture */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Couverture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {coverPreview && (
            <div style={{ marginTop: 12 }}>
              <Image
                src={coverPreview}
                alt="Aperçu"
                width={200}
                height={200}
                style={{ width: 200, height: 200, objectFit: "cover" }}
                loading="lazy"
              />
            </div>
          )}
        </div>
        {/* Description (Rich Text) */}
        <div className="mb-6">
          <RichTextEditor
            value={form.description || ""}
            onChange={val => setForm((prev: any) => ({ ...prev, description: val }))}
            label="Description"
          />
        </div>
        {/* Publier */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Publier</label>
          <select
            name="publier"
            className="w-full border p-4 text-base"
            value={form.publier || "1"}
            onChange={handleChange}
          >
            <option value="1">Oui</option>
            <option value="0">Non</option>
          </select>
        </div>
        {/* Slug */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Slug (optionnel)</label>
          <input
            type="text"
            name="slug"
            className="w-full border p-4 text-base"
            value={form.slug || ""}
            onChange={handleChange}
            placeholder="Laissez vide pour génération automatique"
          />
        </div>
        {/* Alt Cover (SEO) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Alt Cover (SEO)</label>
          <input
            type="text"
            name="alt_cover"
            className="w-full border p-4 text-base"
            value={form.alt_cover || ""}
            onChange={handleChange}
          />
        </div>
        {/* Description Cover (SEO) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Description Cover (SEO)</label>
          <textarea
            name="description_cover"
            className="w-full border p-4 text-base"
            value={form.description_cover || ""}
            onChange={handleChange}
            rows={2}
          />
        </div>
        {/* Meta */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Meta ( name;content/name;content/name;content......)</label>
          <textarea
            name="meta"
            className="w-full border p-4 text-base"
            value={form.meta || ""}
            onChange={handleChange}
            rows={2}
          />
        </div>
        {/* Schema description (seo) */}
        <div className="mb-6">
          <RichTextEditor
            value={form.content_seo || ""}
            onChange={val => setForm((prev: any) => ({ ...prev, content_seo: val }))}
            label="Schema description (seo)"
          />
        </div>
        {/* Review (seo) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Review (seo)</label>
          <input
            type="text"
            name="review"
            className="w-full border p-4 text-base"
            value={form.review || ""}
            onChange={handleChange}
          />
        </div>
        {/* AggregateRating (seo) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">AggregateRating (seo)</label>
          <input
            type="text"
            name="aggregateRating"
            className="w-full border p-4 text-base"
            value={form.aggregateRating || ""}
            onChange={handleChange}
          />
        </div>
        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl"
          disabled={loading}
        >
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}
