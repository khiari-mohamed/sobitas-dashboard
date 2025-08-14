"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Brand } from "@/types/brand";

interface BrandCreateEditFormProps {
  initialBrand?: Partial<Brand>;
  mode: "add" | "edit";
  onSubmit: (brand: Partial<Brand>, logoFile?: File | null) => Promise<void>;
  loading?: boolean;
}

const emptyBrand: Partial<Brand> = {
  designation_fr: "",
  logo: "",
  description_fr: "",
  alt_cover: "",
  description_cover: "",
  meta: "",
  content_seo: "",
  review: "",
  aggregateRating: "",
  nutrition_values: "",
  questions: "",
  more_details: "",
};

export default function BrandCreateEditForm({ initialBrand, mode, onSubmit, loading }: BrandCreateEditFormProps) {
  const [form, setForm] = useState<Partial<Brand>>(initialBrand || emptyBrand);
  const [logoPreview, setLogoPreview] = useState<string | null>(initialBrand?.logo || null);
  const [uploadedLogo, setUploadedLogo] = useState<File | null>(null);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialBrand) {
      setForm(initialBrand);
      setLogoPreview(initialBrand.logo || null);
      setUploadedLogo(null);
    } else {
      setForm(emptyBrand);
      setLogoPreview(null);
      setUploadedLogo(null);
    }
  }, [initialBrand]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedLogo(file);
      setLogoPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, logo: "" })); // logo will be handled by upload
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(form, uploadedLogo);
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1800px] mx-auto">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">{mode === "add" ? "Ajouter une marque" : "Modifier la marque"}</h1>
        <div>
          <label className="block text-xl font-semibold mb-2">Désignation_fr</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.designation_fr || ""}
            onChange={e => handleChange("designation_fr", e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Logo</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded text-base"
            onChange={handleLogoChange}
          />
          {logoPreview && (
            <div className="mt-2 flex items-center">
              <Image
                src={
                  // If it's a File object URL, use it directly
                  logoPreview && logoPreview.startsWith('blob:')
                    ? logoPreview
                  // Priority 1: New uploaded images (start with /brands/)
                  : logoPreview && logoPreview.startsWith('/brands/')
                    ? logoPreview
                  // Priority 2: HTTP URLs
                  : logoPreview && logoPreview.startsWith('http')
                    ? logoPreview
                  // Priority 3: Old dashboard format (brands/April2025/file.webp)
                  : logoPreview && logoPreview !== ""
                    ? logoPreview.startsWith('/') ? logoPreview : `/dashboard/${logoPreview}`
                  // Fallback: Placeholder
                  : "/images/placeholder.png"
                }
                alt="Logo preview"
                width={200}
                height={62}
                className="object-contain border rounded"
                style={{ width: 200, height: 62, background: "#fff", border: "1px solid #eee" }}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/images/placeholder.png";
                }}
              />
            </div>
          )}
        </div>
        <RichTextEditor
          label="Description (FR)"
          value={form.description_fr || ""}
          onChange={val => handleChange("description_fr", val)}
        />
        <div>
          <label className="block text-xl font-semibold mb-2">Alt Cover (SEO)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.alt_cover || ""}
            onChange={e => handleChange("alt_cover", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Description Cover (SEO)</label>
          <textarea
            className="w-full border p-4 rounded text-base"
            value={form.description_cover || ""}
            onChange={e => handleChange("description_cover", e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Meta ( name:content/name:content/name:content......)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.meta || ""}
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
            value={form.review || ""}
            onChange={e => handleChange("review", e.target.value)}
            rows={2}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">AggregateRating (seo)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.aggregateRating || ""}
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
          label="Plus de détails"
          value={form.more_details || ""}
          onChange={val => handleChange("more_details", val)}
        />
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl w-full"
            disabled={loading}
          >
            {mode === "add" ? "Ajouter la marque" : "Enregistrer les modifications"}
          </button>
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded text-xl w-full"
            onClick={() => router.push("/admin/brands")}
            disabled={loading}
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
