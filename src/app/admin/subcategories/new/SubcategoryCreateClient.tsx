"use client";
import React, { useState, useEffect } from "react";

import { useRouter } from "next/navigation";
import { createSubCategory } from "@/services/subcategories";
import { getCategories } from "@/services/categories";
// import { SubCategory } from "@/types/subcategory";
import RichTextEditor from "@/components/ui/RichTextEditor";

const emptySubcategory = {
  category: "",
  designation: "",
  designation_fr: "",
  description_fr: "",
  slug: "",
  cover: null as File | null,
  alt_cover: "",
  description_cove: "",
  meta: "",
  content_seo: "",
  review: "",
  aggregateRating: "",
  nutrition_values: "",
  questions: "",
  more_details: "",
  zone1: "",
  zone2: "",
  zone3: "",
};

export default function SubcategoryCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState(emptySubcategory);
  const [categories, setCategories] = useState<Array<{ _id: string; designation_fr?: string; designation?: string; name?: string }>>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, cover: file }));
  };

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (key: string, value: string | File | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const categoryId = typeof form.category === "string" ? form.category : "";
      
      // Always use JSON - no FormData issues
      const jsonData = {
        name: form.designation_fr || form.designation || "Untitled",
        categoryId: categoryId || null,
        designation: form.designation || "",
        designation_fr: form.designation_fr || "",
        description_fr: form.description_fr || "",
        slug: form.slug || (form.designation_fr ? form.designation_fr.toLowerCase().replace(/\s+/g, '-') : "untitled"),
        alt_cover: form.alt_cover || "",
        description_cove: form.description_cove || "",
        meta: form.meta || "",
        content_seo: form.content_seo || "",
        review: form.review || "",
        aggregateRating: form.aggregateRating || "",
        nutrition_values: form.nutrition_values || "",
        questions: form.questions || "",
        more_details: form.more_details || "",
        zone1: form.zone1 || "",
        zone2: form.zone2 || "",
        zone3: form.zone3 || "",
      };
      await createSubCategory(jsonData, false);
      router.push("/admin/subcategories");
    } catch (error) {
      console.error('Error creating subcategory:', error);
      alert('Erreur lors de la création de la sous-catégorie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1800px] mx-auto">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter une sous-catégorie</h1>
        <div>
          <label className="block text-xl font-semibold mb-2">Catégorie</label>
          <select
            className="w-full border p-4 rounded text-base"
            value={typeof form.category === "string" ? form.category : ""}
            onChange={e => handleChange("category", e.target.value)}
          >
            <option value="">Sélectionner une catégorie...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.designation_fr || cat.designation || cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Couverture</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border p-2 rounded text-base"
          />
          {form.cover && (
            <div className="mt-2">
              <img
                src={URL.createObjectURL(form.cover)}
                alt="Aperçu"
                className="w-48 h-32 object-cover border rounded"
              />
            </div>
          )}
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Slug</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.slug}
            onChange={e => handleChange("slug", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.designation || ''}
            onChange={e => handleChange("designation", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Désignation FR</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.designation_fr}
            onChange={e => handleChange("designation_fr", e.target.value)}
          />
        </div>
        <RichTextEditor
          label="Description FR"
          value={form.description_fr || ""}
          onChange={val => handleChange("description_fr", val)}
        />
        <div>
          <label className="block text-xl font-semibold mb-2">Alt Cover</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.alt_cover}
            onChange={e => handleChange("alt_cover", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Description cover (seo)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.description_cove}
            onChange={e => handleChange("description_cove", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Meta (name;content/name;content...)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.meta}
            onChange={e => handleChange("meta", e.target.value)}
          />
        </div>
        <RichTextEditor
          label="Schema description (seo)"
          value={form.content_seo || ""}
          onChange={val => handleChange("content_seo", val)}
        />
        <div>
          <label className="block text-xl font-semibold mb-2">Review (seo)</label>
          <textarea
            className="w-full border p-4 rounded text-base"
            value={form.review}
            onChange={e => handleChange("review", e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">AggregateRating (seo)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.aggregateRating}
            onChange={e => handleChange("aggregateRating", e.target.value)}
          />
        </div>
        <RichTextEditor
          label="Nutrition Values"
          value={form.nutrition_values || ""}
          onChange={val => handleChange("nutrition_values", val)}
        />
        <RichTextEditor
          label="Questions"
          value={form.questions || ""}
          onChange={val => handleChange("questions", val)}
        />
        <RichTextEditor
          label="More Details"
          value={form.more_details || ""}
          onChange={val => handleChange("more_details", val)}
        />
        <div>
          <label className="block text-xl font-semibold mb-2">Tabilation Zone 1</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.zone1}
            onChange={e => handleChange("zone1", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Tabilation Zone 2</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.zone2}
            onChange={e => handleChange("zone2", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Tabilation Zone 3</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.zone3}
            onChange={e => handleChange("zone3", e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl w-full"
            disabled={loading}
          >
            Créer la sous-catégorie
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded text-xl w-full"
            onClick={() => router.push("/admin/subcategories")}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
