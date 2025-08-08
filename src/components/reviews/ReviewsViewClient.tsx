"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { getAllReviews } from "@/services/reviews";
import { Review } from "@/types/reviews";

function Divider() {
  return <hr className="my-6 border-gray-200" />;
}

export default function ReviewsViewClient({ id }: { id: string }) {
  const [review, setReview] = useState<Review | null>(null);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviews = await getAllReviews();
        const foundReview = reviews.find(r => r._id === id);
        if (foundReview) {
          setReview(foundReview);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchReview();
  }, [id]);

  const handleDelete = () => {
    setShowDelete(false);
    // TODO: Replace with real delete logic
    alert("Avis supprimé (placeholder)");
  };

  const renderStars = (stars: string | number) => {
    const rating = typeof stars === 'string' ? parseInt(stars) : stars;
    return '⭐'.repeat(Math.max(0, Math.min(5, rating)));
  };

  if (!review) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <div className="px-2 sm:px-6 lg:px-12 py-8">
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link
          href={`/admin/reviews/${id}/edit`}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaEdit /> Éditer
        </Link>
        <button
          type="button"
          onClick={() => setShowDelete(true)}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaTrash /> Supprimer
        </button>
        <Link
          href="/admin/reviews"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </Link>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={review.user?.name || "Avis"}
      />

      <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto mt-8 border">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-3">ID</h2>
        <div className="text-2xl text-gray-900 mb-6 font-semibold">{review._id}</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Utilisateur</h3>
        <div className="mb-6 text-lg">{review.user?.name || review.user_id}</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">ID Produit</h3>
        <div className="mb-6 text-lg">{review.product_id}</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Étoiles</h3>
        <div className="mb-6 text-lg">{renderStars(review.stars)} ({review.stars})</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Commentaire</h3>
        <div className="mb-6 text-lg bg-gray-50 border rounded p-4">
          {review.comment || <span className="text-gray-400">Aucun commentaire</span>}
        </div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Publié</h3>
        <div className="mb-6 text-lg">
          <span className={`text-xs px-2 py-1 rounded font-semibold ${review.publier === "1" ? "bg-teal-500 text-white" : "bg-blue-200 text-blue-700"}`}>
            {review.publier === "1" ? "Publié" : "Non publié"}
          </span>
        </div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Date de création</h3>
        <div className="mb-6 text-lg">{review.created_at ? new Date(review.created_at).toLocaleString() : "—"}</div>
        <Divider />

        <h3 className="text-2xl font-bold text-gray-700 mb-3">Date de mise à jour</h3>
        <div className="mb-6 text-lg">{review.updated_at ? new Date(review.updated_at).toLocaleString() : "—"}</div>
      </div>
    </div>
  );
}
