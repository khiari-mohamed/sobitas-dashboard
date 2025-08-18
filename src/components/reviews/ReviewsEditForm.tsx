"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { getAllReviews, updateReview } from "@/services/reviews";
import { Review } from "@/types/reviews";

const Editor = dynamic(() => import("@/components/ui/RichTextEditor"), { ssr: false });

export default function ReviewsEditForm({ id }: { id: string }) {
  const router = useRouter();
  const [form, setForm] = useState<Partial<Review>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviews = await getAllReviews();
        const review = reviews.find(r => r._id === id);
        if (review) {
          // Add missing fields that might not be in aggregated data
          const fullReview = {
            ...review,
            id: review._id, // Use _id as id for updates
            user_id: review.user_id || '',
            product_id: review.product_id || ''
          };
          setForm(fullReview);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReview();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCommentChange = (value: string) => {
    setForm({ ...form, comment: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (form.id) {
        await updateReview(form.id, form);
        router.push("/admin/reviews");
      } else {
        setError("ID manquant pour la mise à jour");
      }
    } catch (err: unknown) {
      setError((err as Error).message || "Erreur lors de la mise à jour de l&apos;avis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Modifier l&apos;avis</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-8">
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID</label>
          <input type="text" name="_id" value={form._id || ""} onChange={handleChange} className="w-full border p-4 text-base" readOnly />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID Utilisateur</label>
          <input type="text" name="user_id" value={form.user_id || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">ID Produit</label>
          <input type="text" name="product_id" value={form.product_id || ""} onChange={handleChange} className="w-full border p-4 text-base" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Étoiles</label>
          <select name="stars" value={form.stars || "5"} onChange={handleChange} className="w-full border p-4 text-base">
            <option value="1">1 étoile</option>
            <option value="2">2 étoiles</option>
            <option value="3">3 étoiles</option>
            <option value="4">4 étoiles</option>
            <option value="5">5 étoiles</option>
          </select>
        </div>
        <div className="mb-6">
          <Editor
            value={form.comment === null ? "" : (form.comment || "")}
            onChange={handleCommentChange}
            label="Commentaire"
          />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Publier</label>
          <select name="publier" value={form.publier || "1"} onChange={handleChange} className="w-full border p-4 text-base">
            <option value="1">Publié</option>
            <option value="0">Non publié</option>
          </select>
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de création</label>
          <input type="text" name="created_at" value={form.created_at ? new Date(form.created_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        <div className="mb-6">
          <label className="block text-xl font-semibold mb-2">Date de mise à jour</label>
          <input type="text" name="updated_at" value={form.updated_at ? new Date(form.updated_at).toLocaleString() : "—"} readOnly className="w-full border p-4 text-base bg-gray-100 cursor-not-allowed" />
        </div>
        {error && <div className="text-red-500 mb-4 col-span-2">{error}</div>}
        <div className="col-span-1">
          <button type="submit" className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 text-xl border-none" disabled={loading}>
            {loading ? "Mise à jour..." : "Mettre à jour l&apos;avis"}
          </button>
        </div>
      </form>
    </div>
  );
}
