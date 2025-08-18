"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createPack } from "@/services/pack";
import { Pack } from "@/types/pack";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

const initialState: Partial<Pack> = {
  designation_fr: "",
  prix: "",
  promo: "",
  qte: "",
  publier: "1",
  pack: "1",
  new_product: "0",
  best_seller: "0",
  rupture: "0",
  cover: "",
  description_fr: "",
  meta_description_fr: "",
  questions: "",
  nutrition_values: "",
  zone1: "Description",
  zone2: "Avis client",
  zone3: "Valeurs nutritionnelles",
  zone4: "Questions"
};

export default function PacksCreateClient() {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Pack>>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRichTextChange = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createPack(form, selectedFile || undefined);
      router.push("/admin/packs");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erreur lors de la création du pack");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Ajouter un nouveau pack</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input type="text" name="designation_fr" value={form.designation_fr || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Prix</label>
          <input type="number" name="prix" value={form.prix || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Promo</label>
          <input type="number" name="promo" value={form.promo || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Quantité</label>
          <input type="number" name="qte" value={form.qte || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Couverture</label>
          <div className="space-y-2">
            <input type="text" name="cover" value={form.cover || ""} onChange={handleChange} className="w-full border p-4 text-base" placeholder="Chemin de l'image" />
            <input type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setSelectedFile(file);
                // Show preview
                const reader = new FileReader();
                reader.onload = () => {
                  setForm({ ...form, cover: reader.result as string });
                };
                reader.readAsDataURL(file);
              }
            }} className="w-full border p-2 text-base" />
            <p className="text-sm text-gray-500">Vous pouvez soit saisir un chemin d&apos;image, soit télécharger un fichier</p>
          </div>
        </div>
        <div className="mb-6">
          <Editor
            value={form.description_fr || ""}
            onChange={(value: string) => handleRichTextChange("description_fr", value)}
            label="Description"
          />
        </div>
        <div className="mb-6">
          <Editor
            value={form.meta_description_fr || ""}
            onChange={(value: string) => handleRichTextChange("meta_description_fr", value)}
            label="Meta Description"
          />
        </div>
        <div className="mb-6">
          <Editor
            value={form.questions || ""}
            onChange={(value: string) => handleRichTextChange("questions", value)}
            label="Questions"
          />
        </div>
        <div className="mb-6">
          <Editor
            value={form.nutrition_values || ""}
            onChange={(value: string) => handleRichTextChange("nutrition_values", value)}
            label="Valeurs nutritionnelles"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Zone 1</label>
          <input type="text" name="zone1" value={form.zone1 || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Zone 2</label>
          <input type="text" name="zone2" value={form.zone2 || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Zone 3</label>
          <input type="text" name="zone3" value={form.zone3 || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Zone 4</label>
          <input type="text" name="zone4" value={form.zone4 || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Publier</label>
          <select name="publier" value={form.publier || "1"} onChange={handleChange} className="w-full border p-4 text-base">
            <option value="1">Publié</option>
            <option value="0">Non publié</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Pack</label>
          <select name="pack" value={form.pack || "1"} onChange={handleChange} className="w-full border p-4 text-base">
            <option value="1">Oui</option>
            <option value="0">Non</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Nouveau produit</label>
          <select name="new_product" value={form.new_product || "0"} onChange={handleChange} className="w-full border p-4 text-base">
            <option value="1">Oui</option>
            <option value="0">Non</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Meilleure vente</label>
          <select name="best_seller" value={form.best_seller || "0"} onChange={handleChange} className="w-full border p-4 text-base">
            <option value="1">Oui</option>
            <option value="0">Non</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Rupture de stock</label>
          <select name="rupture" value={form.rupture || "0"} onChange={handleChange} className="w-full border p-4 text-base">
            <option value="1">Oui</option>
            <option value="0">Non</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1">
          <button type="submit" className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Création..." : "Créer le pack"}
          </button>
        </div>
      </form>
    </div>
  );
}
