"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllReviews, deleteReview } from "@/services/reviews";
import { Review } from "@/types/reviews";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function ReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getAllReviews()
      .then((data) => {
        if (!ignore) {
          setReviews(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = reviews.filter((r) =>
    (r.user?.name || r.user_id || "")
      .toLowerCase()
      .includes(search.toLowerCase()) ||
    (r.comment || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : reviews;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentReviews = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (id: string) => {
    setDeleteReviewId(id);
  };

  const handleConfirmDelete = async () => {
    if (deleteReviewId) {
      try {
        await deleteReview(deleteReviewId);
        setReviews((prev) => prev.filter(r => r._id !== deleteReviewId));
        setDeleteReviewId(null);
      } catch (error) {
        console.error('Error deleting review:', error);
      }
    }
  };

  const handleConfirmDeleteSelection = async () => {
    try {
      for (const id of selectedIds) {
        await deleteReview(id);
      }
      setReviews((prev) => prev.filter(r => !r._id || !selectedIds.includes(r._id)));
      setSelectedIds([]);
      setDeleteSelectionOpen(false);
    } catch (error) {
      console.error('Error deleting reviews:', error);
    }
  };

  const renderStars = (stars: string | number) => {
    const rating = typeof stars === 'string' ? parseInt(stars) : stars;
    return '⭐'.repeat(Math.max(0, Math.min(5, rating)));
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteReviewId}
        onClose={() => setDeleteReviewId(null)}
        onConfirm={handleConfirmDelete}
        productName={reviews.find(r => r._id === deleteReviewId)?.user?.name || "Avis"}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleConfirmDeleteSelection}
        productName={selectedIds.length === 1
          ? (reviews.find(r => r._id === selectedIds[0])?.user?.name)
          : `${selectedIds.length} avis`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Avis</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/reviews/new')}
          >
            + Ajouter nouveau
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
            disabled={selectedIds.length === 0}
            onClick={() => setDeleteSelectionOpen(true)}
          >
            🗑 Supprimer la sélection
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Chercher par utilisateur ou commentaire"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded w-full text-sm pr-10"
          />
          <FaSearch className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto" style={{ maxHeight: 'none' }}>
        <table className="min-w-full border divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-[#f9fafb] text-gray-700">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && currentReviews.every(r => r._id && selectedIds.includes(r._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentReviews.map(r => r._id).filter((id): id is string => Boolean(id))])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentReviews.map(r => r._id).filter(Boolean).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">ID</th>
              <th className="px-4 py-2">Utilisateur</th>
              <th className="px-4 py-2">Produit ID</th>
              <th className="px-4 py-2">Étoiles</th>
              <th className="px-4 py-2">Commentaire</th>
              <th className="px-4 py-2">Publié</th>
              <th className="px-4 py-2">Date de création</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentReviews.map((review) => (
              <tr key={review._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={review._id ? selectedIds.includes(review._id) : false}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => review._id ? [...prev, review._id] : prev);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== review._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/reviews/${review._id}/view`)}>
                  {review._id}
                </td>
                <td className="px-4 py-2">{review.user?.name || review.user_id}</td>
                <td className="px-4 py-2">{review.product_id}</td>
                <td className="px-4 py-2">{renderStars(review.stars)}</td>
                <td className="px-4 py-2 max-w-xs truncate">{review.comment || "—"}</td>
                <td className="px-4 py-2">
                  <span className={`text-xs px-2 py-1 rounded ${review.publier === "1" ? "bg-teal-500 text-white" : "bg-blue-200 text-blue-700"}`}>
                    {review.publier === "1" ? "Publié" : "Non publié"}
                  </span>
                </td>
                <td className="px-4 py-2">{review.created_at ? new Date(review.created_at).toLocaleString() : "—"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/reviews/${review._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/reviews/${review._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => review._id && handleDelete(review._id)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentReviews.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-6 text-center text-gray-400">
                  Aucun avis trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 text-sm text-gray-600 w-full">
        <div className="flex items-center gap-2 mb-2 sm:mb-0">
          <span>Afficher</span>
          <select
            className="border rounded px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={e => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            {[10, 15, 25, 50].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <span>entrées par page</span>
        </div>
        <p>
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(startIndex + currentReviews.length, paginated.length)} de {paginated.length} entrées
        </p>
        <div className="mt-2 sm:mt-0 space-x-2">
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            ← Précédent
          </button>
          <button
            disabled={currentPage >= totalPages || totalPages === 0 || loading}
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Suivant →
          </button>
        </div>
      </div>
    </div>
  );
}
