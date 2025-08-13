"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateSubCategory } from "@/services/subcategories";
import { getCategories } from "@/services/categories";
import { SubCategory } from "@/types/subcategory";
import RichTextEditor from "@/components/ui/RichTextEditor";

export default function SubcategoryEditForm({ subcategory }: { subcategory: SubCategory }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<SubCategory>>({ ...subcategory });
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const categoryId = typeof form.category === "string" ? form.category : (form.category as any)?._id || "";
      
      await updateSubCategory(subcategory._id, {
        name: form.designation_fr || form.name || "Untitled",
        categoryId: categoryId || null,
        designation: form.designation || form.designation_fr || "",
        designation_fr: form.designation_fr || "",
        description_fr: form.description_fr || "",
        slug: form.slug || "",
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
      } as any);
      router.push("/admin/subcategories");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1800px] mx-auto">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier la sous-catégorie</h1>
        <div>
          <label className="block text-xl font-semibold mb-2">Catégorie</label>
          <select
            className="w-full border p-4 rounded text-base"
            value={typeof form.category === "string" ? form.category : (form.category as any)?._id || ""}
            onChange={e => handleChange("category", e.target.value)}
            required
          >
            <option value="">Sélectionner une catégorie...</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.designation_fr || cat.designation || cat.name}</option>
            ))}
          </select>
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
          <label className="block text-xl font-semibold mb-2">Slug</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.slug}
            onChange={e => handleChange("slug", e.target.value)}
          />
        </div>
        <div>
          <RichTextEditor
            value={form.description_fr || ''}
            onChange={value => handleChange("description_fr", value)}
            label="Description"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Alt Cover</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.alt_cover || ''}
            onChange={e => handleChange("alt_cover", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Description cover (seo)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.description_cove || ''}
            onChange={e => handleChange("description_cove", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Meta (name;content/name;content...)</label>
          <textarea
            className="w-full border p-4 rounded text-base"
            value={form.meta || ''}
            onChange={e => handleChange("meta", e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Schema description (seo)</label>
          <textarea
            className="w-full border p-4 rounded text-base"
            value={form.content_seo || ''}
            onChange={e => handleChange("content_seo", e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Review (seo)</label>
          <textarea
            className="w-full border p-4 rounded text-base"
            value={form.review || ''}
            onChange={e => handleChange("review", e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">AggregateRating (seo)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.aggregateRating || ''}
            onChange={e => handleChange("aggregateRating", e.target.value)}
          />
        </div>
        <div>
          <RichTextEditor
            value={form.nutrition_values || ''}
            onChange={value => handleChange("nutrition_values", value)}
            label="Nutrition Values"
          />
        </div>
        <div>
          <RichTextEditor
            value={form.questions || ''}
            onChange={value => handleChange("questions", value)}
            label="Questions"
          />
        </div>
        <div>
          <RichTextEditor
            value={form.more_details || ''}
            onChange={value => handleChange("more_details", value)}
            label="More Details"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Tabilation Zone 1</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.zone1 || ''}
            onChange={e => handleChange("zone1", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Tabilation Zone 2</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.zone2 || ''}
            onChange={e => handleChange("zone2", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Tabilation Zone 3</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.zone3 || ''}
            onChange={e => handleChange("zone3", e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl w-full"
            disabled={loading}
          >
            Enregistrer les modifications
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
