"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { fetchAllPacks, updatePack } from "@/services/pack";
import { Pack } from "@/types/pack";
import { getPackImageWithFallback } from "@/utils/imageUtils";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

export default function PacksEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Pack>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchPack = async () => {
      try {
        const packs = await fetchAllPacks();
        const pack = packs.find(p => p._id === id);
        if (pack) {
          setForm(pack);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchPack();
  }, [id]);

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
      await updatePack(id, form, selectedFile || undefined);
      router.push("/admin/packs");
    } catch (err: unknown) {
      setError((err as Error).message || "Erreur lors de la mise à jour du pack");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier le pack</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Désignation</label>
          <input
            type="text"
            name="designation_fr"
            value={form.designation_fr || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Prix</label>
          <input
            type="number"
            name="prix"
            value={form.prix || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Promo</label>
          <input
            type="number"
            name="promo"
            value={form.promo || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Quantité</label>
          <input
            type="number"
            name="qte"
            value={form.qte || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Couverture</label>
          <div className="space-y-2">
            <input
              type="text"
              name="cover"
              value={form.cover || ""}
              onChange={handleChange}
              className="w-full border p-4 text-base"
              placeholder="Chemin de l'image"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
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
              }}
              className="w-full border p-2 text-base"
            />
            {form.cover && (
              <div className="mt-2">
                <img
                  src={selectedFile ? form.cover : (() => {
                    const { src } = getPackImageWithFallback(form);
                    return src;
                  })()}
                  alt="Aperçu"
                  className="max-w-xs h-auto border rounded"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!selectedFile) {
                      const { fallback } = getPackImageWithFallback(form);
                      if (fallback && target.src !== fallback) {
                        target.src = fallback;
                      } else {
                        target.src = "/images/placeholder.png";
                      }
                    } else {
                      target.src = "/images/placeholder.png";
                    }
                  }}
                />
              </div>
            )}
            <p className="text-sm text-gray-500">
              Vous pouvez soit saisir un chemin d&apos;image, soit télécharger un fichier
            </p>
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
          <label className="block text-xl font-semibold mb-2">Statut</label>
          <select
            name="status"
            value={form.status || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          >
            <option value="">Sélectionner un statut</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Publier</label>
          <select
            name="publier"
            value={form.publier || ""}
            onChange={handleChange}
            className="w-full border p-4 text-base"
          >
            <option value="">Sélectionner</option>
            <option value="1">Oui</option>
            <option value="0">Non</option>
          </select>
        </div>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Mise à jour..." : "Mettre à jour"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin/packs")}
            className="bg-gray-500 text-white px-6 py-3 rounded hover:bg-gray-600"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
