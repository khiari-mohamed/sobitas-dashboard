"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAnnonceById, updateAnnonce } from "@/services/annonces";
import { Annonce } from "@/types/annonces";

const initialState: Partial<Annonce> = {
  id: "",
  image_1: "",
  image_2: "",
  image_3: "",
  image_4: "",
  image_5: "",
  image_6: "",
  link_img_1: "",
  link_img_2: "",
  link_img_3: "",
  link_img_4: "",
  link_img_5: "",
  link_img_6: "",
  products_default_cover: "",
  created_at: "",
  updated_at: ""
};

export default function AnnouncesEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Annonce>>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<{ [key: string]: string | null }>({});
  const fileInputs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetchAnnonceById(id)
      .then((annonce) => {
        setForm(annonce);
        // Set previews for existing images
        [1,2,3,4,5,6].forEach(n => {
          if (annonce[`image_${n}` as keyof Annonce]) {
            const imagePath = (annonce[`image_${n}` as keyof Annonce] as string).startsWith('/') ? (annonce[`image_${n}` as keyof Annonce] as string) : `/${annonce[`image_${n}` as keyof Annonce]}`;
            setImagePreviews(prev => ({ ...prev, [`image_${n}`]: imagePath }));
          }
        });
        if (annonce.products_default_cover) {
          const coverPath = annonce.products_default_cover.startsWith('/') ? annonce.products_default_cover : `/${annonce.products_default_cover}`;
          setImagePreviews(prev => ({ ...prev, products_default_cover: coverPath }));
        }
      })
      .catch(() => setError("Annonce introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setForm({ ...form, [key]: file });
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreviews(prev => ({ ...prev, [key]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const getFileName = (fileOrString: string | File | null | undefined) => {
    if (!fileOrString) return "";
    if (typeof fileOrString === "string") return fileOrString.split("/").pop();
    if (fileOrString.name) return fileOrString.name;
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // You may need to handle file upload as multipart/form-data if backend expects it
      await updateAnnonce(id, form);
      router.push("/admin/announces");
    } catch (err) {
      setError((err as Error).message || "Erreur lors de la modification de l&apos;annonce");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12">Chargement...</div>;

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier l&apos;annonce</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* ID (readonly) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <input type="text" name="id" value={form.id || ""} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {/* Images and Links */}
        {[1,2,3,4,5,6].map(n => (
          <React.Fragment key={n}>
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-2">Image {n}</label>
              <input
                type="file"
                accept="image/*"
                ref={el => { fileInputs.current[`image_${n}`] = el; }}
                onChange={e => handleImageChange(e, `image_${n}`)}
                className="w-full border p-2 text-base"
              />
              {imagePreviews[`image_${n}`] && (
                <img src={imagePreviews[`image_${n}`] as string} alt={`img${n} preview`} className="mt-2 border rounded" style={{ width: 100, height: 60, objectFit: 'contain' }} />
              )}
              <div className="text-xs text-gray-500 mt-1">{getFileName(form[`image_${n}` as keyof Annonce])}</div>
            </div>
            <div className="mb-6">
              <label className="block text-xl font-semibold mb-2">Lien {n}</label>
              <input type="text" name={`link_img_${n}`} value={form[`link_img_${n}` as keyof Annonce] as string || ""} onChange={handleChange} className="w-full border p-4 text-base" />
            </div>
          </React.Fragment>
        ))}
        {/* Default Cover (upload + preview) */}
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Default Cover</label>
          <input
            type="file"
            accept="image/*"
            ref={el => { fileInputs.current.products_default_cover = el; }}
            onChange={e => handleImageChange(e, "products_default_cover")}
            className="w-full border p-2 text-base"
          />
          {imagePreviews.products_default_cover && (
            <img src={imagePreviews.products_default_cover as string} alt="default cover preview" className="mt-2 border rounded" style={{ width: 100, height: 60, objectFit: 'contain' }} />
          )}
          <div className="text-xs text-gray-500 mt-1">{getFileName(form.products_default_cover)}</div>
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
          <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Modification..." : "Enregistrer les modifications"}
          </button>
        </div>
      </form>
    </div>
  );
}
