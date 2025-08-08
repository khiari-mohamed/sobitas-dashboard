"use client";

import React, { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaMagic, FaTrash, FaArrowLeft } from "react-icons/fa";
import { getAutofillTemplate } from "@/utils/productAutofillTemplates";
import { fetchSubcategories } from "@/utils/fetchSubcategories";
import { getAllBrands } from "@/utils/brands";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

const emptyProduct = {
  designationFr: "",
  cover: "",
  subCategory: [] as string[],
  brand: "",
  qte: "",
  prix: "",
  promo: "",
  promoExpirationDate: "",
  metaDescriptionFr: "",
  descriptionFr: "",
  questions: "",
  nutritionValues: "",
  publier: false,
  slug: "",
  pack: false,
  gallery: [] as File[],
  newProduct: false,
  rupture: false,
  note: "",
  bestSeller: false,
  aromaIds: [],
  tags: "",
  meta: "",
  codeProduct: "",
  altCover: "",
  descriptionCover: "",
  schemaDescription: "",
  review: "",
  aggregateRating: "",
  zone1: "",
  zone2: "",
  zone3: "",
  zone4: "",
};

const generateRandomCode = () =>
  `SBT-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;




export default function ProductCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState(emptyProduct);
  const [allSubcategories, setAllSubcategories] = useState<{ _id: string; designation: string }[]>([]);
  const [allBrands, setAllBrands] = useState<{ _id: string; designation_fr: string }[]>([]);
  const [productDb, setProductDb] = useState<any[]>([]);
  const fileInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  useEffect(() => {
    fetchSubcategories().then((data) => {
      setAllSubcategories(
        Array.isArray(data)
          ? data.map((s: any) => ({ _id: s._id, designation: s.designation || s.designation_fr || s.title || s.slug }))
          : []
      );
    });
    getAllBrands().then((brands) => {
      setAllBrands(Array.isArray(brands) ? brands : []);
    });
    // Fetch product DB JSON
    fetch('/protein_db.products.json')
      .then(res => res.json())
      .then(data => setProductDb(Array.isArray(data) ? data : []))
      .catch(() => setProductDb([]));
  }, []);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };


// ✅ Your handleAutofill function
const autofillKeyMap: Record<string, keyof typeof emptyProduct> = {
  designation_fr: "designationFr",
  description_fr: "descriptionFr",
  description: "descriptionFr",
  meta_description_fr: "metaDescriptionFr",
  meta_description: "metaDescriptionFr",
  nutrition_values: "nutritionValues",
  questions: "questions",
  alt_cover: "altCover",
  description_cover: "descriptionCover",
  meta: "meta",
  zone1: "zone1",
  zone2: "zone2",
  zone3: "zone3",
  zone4: "zone4",
  schema_description: "schemaDescription",
  review: "review",
  aggregate_rating: "aggregateRating",
  // promo, prix, qte, publier handled below
};
const handleAutofill = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();

  const input = (form.designationFr || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  // Try to find the best match from productDb
  let bestMatch = null;
  let bestScore = 0;
  for (const prod of productDb) {
    const prodName = (prod.designation_fr || "").replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (!prodName) continue;
    // Score: exact match > includes > partial
    if (prodName === input) {
      bestMatch = prod;
      bestScore = 100;
      break;
    } else if (prodName.includes(input) || input.includes(prodName)) {
      if (bestScore < 80) {
        bestMatch = prod;
        bestScore = 80;
      }
    } else {
      // Partial word match
      const inputWords = input.split(/\s+/);
      let matchCount = 0;
      for (const w of inputWords) {
        if (w && prodName.includes(w)) matchCount++;
      }
      if (matchCount > 0 && matchCount > bestScore) {
        bestMatch = prod;
        bestScore = matchCount;
      }
    }
  }

  if (bestMatch) {
    // Map productDb fields to form fields
    const normalizedFields: Partial<typeof emptyProduct> = {
      designationFr: bestMatch.designation_fr || "",
      descriptionFr: bestMatch.description_fr || "",
      metaDescriptionFr: bestMatch.meta_description_fr || "",
      nutritionValues: bestMatch.nutrition_values || "",
      questions: bestMatch.questions || "",
      altCover: bestMatch.alt_cover || "",
      descriptionCover: bestMatch.description_cover || "",
      meta: bestMatch.meta || "",
      zone1: bestMatch.zone1 || "",
      zone2: bestMatch.zone2 || "",
      zone3: bestMatch.zone3 || "",
      zone4: bestMatch.zone4 || "",
      schemaDescription: bestMatch.schema_description || "",
      review: bestMatch.review || "",
      aggregateRating: bestMatch.aggregateRating || "",
      promo: bestMatch.promo || "",
      prix: bestMatch.prix || "",
      qte: bestMatch.qte || "",
      publier: bestMatch.publier === "1" || bestMatch.publier === true,
      codeProduct: bestMatch.code_product || bestMatch.codeProduct || "",
      slug: bestMatch.slug || "",
      pack: bestMatch.pack === "1" || bestMatch.pack === true,
      note: bestMatch.note || "5",
      bestSeller: bestMatch.best_seller === "1" || bestMatch.best_seller === true,
      newProduct: bestMatch.new_product === "1" || bestMatch.new_product === true,
      rupture: bestMatch.rupture === "1" || bestMatch.rupture === true,
      cover: bestMatch.cover ? `/` + bestMatch.cover.replace(/^\/+/, "") : "",
      // gallery, aromaIds, tags, brand, subCategory left for manual
    };
    setForm((prev) => ({
      ...prev,
      ...normalizedFields,
      codeProduct: prev.codeProduct || normalizedFields.codeProduct || generateRandomCode(),
    }));
    return;
  }

  // fallback to old template logic
  const template = getAutofillTemplate(input);
  if (!template) {
    alert("Aucune suggestion trouvée pour ce nom de produit.");
    return;
  }
  const normalizedFields: Partial<typeof emptyProduct> = {};
  Object.entries(template.fields).forEach(([key, value]) => {
    const camelKey = autofillKeyMap[key];
    if (camelKey) {
      if ([
        "metaDescriptionFr",
        "descriptionFr",
        "questions",
        "nutritionValues",
        "schemaDescription",
        "review"
      ].includes(camelKey)) {
        normalizedFields[camelKey] = value ?? "";
      } else {
        normalizedFields[camelKey] = typeof value === "number" ? value.toString() : value ?? "";
      }
    } else if (key === "promo") {
      normalizedFields.promo = typeof value === "number" ? value.toString() : value ?? "";
    } else if (key === "prix") {
      normalizedFields.prix = typeof value === "number" ? value.toString() : value ?? "";
    } else if (key === "qte") {
      normalizedFields.qte = typeof value === "number" ? value.toString() : value ?? "";
    } else if (key === "publier") {
      normalizedFields.publier = Boolean(value);
    }
  });
  setForm((prev) => ({
    ...prev,
    ...normalizedFields,
    newProduct: true,
    bestSeller: false,
    rupture: false,
    publier: true,
    codeProduct: prev.codeProduct || generateRandomCode(),
    note: "5",
  }));
};


 const handleReset = () => setForm(emptyProduct);

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const fileUrl = URL.createObjectURL(e.target.files[0]);
    setForm((prev) => ({ ...prev, cover: fileUrl }));
  }
};


  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setForm((prev) => ({
      ...prev,
      gallery: files ? Array.from(files) : [],
    }));
  };

  // Handle dropdown select for subcategories
  const handleSubcategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    if (selectedId && !form.subCategory.includes(selectedId)) {
      setForm((prev) => ({ ...prev, subCategory: [...prev.subCategory, selectedId] }));
    }
  };

  // Remove subcategory
  const removeSubcategory = (id: string) => {
    setForm((prev) => ({ ...prev, subCategory: prev.subCategory.filter((sc) => sc !== id) }));
  };

  // Handle manual typing for subcategories
  const handleSubcategoryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const values = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
    setForm((prev) => ({ ...prev, subCategory: values }));
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-[1800px] mx-auto">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <button
          type="button"
          onClick={handleAutofill}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaMagic /> Suggestion automatique
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaTrash /> Réinitialiser
        </button>
        <button
          type="button"
          onClick={() => router.push("/produits")}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </button>
      </div>
      <form className="space-y-6">
        <div>
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.designationFr}
            onChange={e => handleChange("designationFr", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Couverture</label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="mt-2"
            onChange={handleFileChange}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Sous-catégories</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {form.subCategory.map((id) => {
              const sub = allSubcategories.find(s => s._id === id);
              return (
                <span key={id} className="bg-gray-200 px-3 py-1 rounded-full flex items-center">
                  {sub ? sub.designation : id}
                  <button type="button" className="ml-2 text-red-500" onClick={() => removeSubcategory(id)}>&times;</button>
                </span>
              );
            })}
          </div>
          <select
            className="w-full border p-4 rounded text-base mb-2"
            value=""
            onChange={handleSubcategorySelect}
          >
            <option value="">Ajouter une sous-catégorie...</option>
            {allSubcategories.filter(s => !form.subCategory.includes(s._id)).map(s => (
              <option key={s._id} value={s._id}>{s.designation}</option>
            ))}
          </select>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.subCategory.map(id => {
              const sub = allSubcategories.find(s => s._id === id);
              return sub ? sub.designation : id;
            }).join(", ")}
            onChange={handleSubcategoryInput}
            placeholder="Tapez ou collez des sous-catégories, séparées par des virgules"
          />
        </div>
        {/* --- RESTORE ALL OTHER FIELDS BELOW, UNCHANGED --- */}
        <div>
          <label className="block text-xl font-semibold mb-2">Marque</label>
          <select
            className="w-full border p-4 rounded text-base mb-2"
            value={form.brand || ""}
            onChange={e => handleChange("brand", e.target.value)}
          >
            <option value="">Sélectionner une marque...</option>
            {allBrands.map((b) => (
              <option key={b._id} value={b._id}>{b.designation_fr}</option>
            ))}
          </select>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.brand}
            onChange={e => handleChange("brand", e.target.value)}
            placeholder="Tapez ou collez une marque, ou sélectionnez ci-dessus"
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xl font-semibold mb-2">Quantité</label>
            <input
              type="number"
              className="w-full border p-4 rounded text-base"
              value={form.qte}
              onChange={e => handleChange("qte", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xl font-semibold mb-2">Prix</label>
            <input
              type="number"
              className="w-full border p-4 rounded text-base"
              value={form.prix}
              onChange={e => handleChange("prix", e.target.value)}
            />
          </div>
          <div className="flex-1">
            <label className="block text-xl font-semibold mb-2">Promo</label>
            <input
              type="number"
              className="w-full border p-4 rounded text-base"
              value={form.promo}
              onChange={e => handleChange("promo", e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Date d'expiration du promo (Ventes Flash)</label>
          <input
            type="date"
            className="w-full border p-4 rounded text-base"
            value={form.promoExpirationDate}
            onChange={e => handleChange("promoExpirationDate", e.target.value)}
          />
        </div>
        <div>
          <Editor
            key={form.metaDescriptionFr}
            value={form.metaDescriptionFr}
            onChange={value => handleChange("metaDescriptionFr", value)}
            label="Meta Description"
          />
        </div>
        <div>
          <Editor
            key={form.descriptionFr}
            value={form.descriptionFr}
            onChange={value => handleChange("descriptionFr", value)}
            label="Description"
          />
        </div>
        <div>
          <Editor
            key={form.questions}
            value={form.questions}
            onChange={value => handleChange("questions", value)}
            label="Questions"
          />
        </div>
        <div>
          <Editor
            key={form.nutritionValues}
            value={form.nutritionValues}
            onChange={value => handleChange("nutritionValues", value)}
            label="Nutrition Values"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xl font-semibold">Publier</label>
          <input
            type="checkbox"
            checked={!!form.publier}
            onChange={e => handleChange("publier", e.target.checked)}
            className="w-5 h-5"
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
        <div className="flex items-center gap-4">
          <label className="text-xl font-semibold">Pack</label>
          <input
            type="checkbox"
            checked={!!form.pack}
            onChange={e => handleChange("pack", e.target.checked)}
            className="w-5 h-5"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Galerie d’images</label>
          <input
            ref={galleryInputRef}
            type="file"
            multiple
            className="mt-2"
            onChange={handleGalleryChange}
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xl font-semibold">Nouveau produit</label>
          <input
            type="checkbox"
            checked={!!form.newProduct}
            onChange={e => handleChange("newProduct", e.target.checked)}
            className="w-5 h-5"
          />
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xl font-semibold">Etat de stock (Rupture)</label>
          <input
            type="checkbox"
            checked={!!form.rupture}
            onChange={e => handleChange("rupture", e.target.checked)}
            className="w-5 h-5"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Nombre d'étoiles</label>
          <select
            className="w-full border p-4 rounded text-base"
            value={form.note}
            onChange={e => handleChange("note", e.target.value)}
          >
            <option value="">Sélectionner</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label className="text-xl font-semibold">Meilleures ventes</label>
          <input
            type="checkbox"
            checked={!!form.bestSeller}
            onChange={e => handleChange("bestSeller", e.target.checked)}
            className="w-5 h-5"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Aromas</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.aromaIds.join(", ")}
            onChange={e => handleChange("aromaIds", e.target.value.split(",").map(s => s.trim()))}
            placeholder="Séparez par des virgules"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Tags</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.tags}
            onChange={e => handleChange("tags", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Meta (name;content...)</label>
          <textarea
            className="w-full border p-4 rounded text-base"
            value={form.meta}
            onChange={e => handleChange("meta", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Code Produit</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.codeProduct}
            onChange={e => handleChange("codeProduct", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Alt Cover (SEO)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.altCover}
            onChange={e => handleChange("altCover", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Description Cover (SEO)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.descriptionCover}
            onChange={e => handleChange("descriptionCover", e.target.value)}
          />
        </div>
        <div>
          <Editor
            key={form.schemaDescription}
            value={form.schemaDescription}
            onChange={value => handleChange("schemaDescription", value)}
            label="Schema Description"
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">Review (SEO)</label>
          <textarea
            className="w-full border p-4 rounded text-base"
            value={form.review}
            onChange={e => handleChange("review", e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xl font-semibold mb-2">AggregateRating (SEO)</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.aggregateRating}
            onChange={e => handleChange("aggregateRating", e.target.value)}
          />
        </div>
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
        <div>
          <label className="block text-xl font-semibold mb-2">Tabilation Zone 4</label>
          <input
            type="text"
            className="w-full border p-4 rounded text-base"
            value={form.zone4}
            onChange={e => handleChange("zone4", e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded text-xl"
        >
          Créer le produit
        </button>
      </form>
    </div>
  );
}
