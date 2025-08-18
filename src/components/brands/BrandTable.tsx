"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Brand } from "@/types/brand";
import { getAllBrands } from "@/utils/brands";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { FaSearch } from "react-icons/fa";

const defaultItemsPerPage = 10;

export default function BrandTable() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // const [totalBrands, setTotalBrands] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch brands from backend
  useEffect(() => {
    let ignore = false;
    setLoading(true);
    getAllBrands()
      .then((data) => {
        if (!ignore) {
          setBrands(data);
          // setTotalBrands(data.length);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, []);

  // Filtering on frontend for search
  const filtered = brands.filter((b) =>
    (b.designation_fr || "").toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const handleDelete = (brand: Brand) => {
    setDeleteBrand(brand);
  };

  const handleConfirmDelete = async () => {
    if (deleteBrand) {
      try {
        const { deleteBrand: deleteBrandService } = await import('@/utils/brands');
        await deleteBrandService(deleteBrand._id);
        setBrands((prev) => prev.filter(b => b._id !== deleteBrand._id));
        setSelectedIds((prev) => prev.filter(id => id !== deleteBrand._id));
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Erreur lors de la suppression de la marque');
      }
    }
    setDeleteBrand(null);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteBrand}
        onClose={() => setDeleteBrand(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteBrand?.designation_fr}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={async () => {
          try {
            const { deleteBrand: deleteBrandService } = await import('@/utils/brands');
            for (const id of selectedIds) {
              await deleteBrandService(id);
            }
            setBrands((prev) => prev.filter(b => !selectedIds.includes(b._id)));
            setSelectedIds([]);
          } catch (error) {
            console.error('Error deleting brands:', error);
            alert('Erreur lors de la suppression des marques');
          }
          setDeleteSelectionOpen(false);
        }}
        productName={selectedIds.length === 1
          ? (brands.find(b => b._id === selectedIds[0])?.designation_fr)
          : `${selectedIds.length} marques`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Marques</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/brands/new')}
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
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Chercher"
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
      {/* Table */}
      <div className="overflow-x-auto" style={{ maxHeight: 'none' }}>
        <table className="min-w-full border divide-y divide-gray-200 text-sm text-left">
          <thead className="bg-[#f9fafb] text-gray-700">
            <tr>
              <th className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && paginated.every(b => selectedIds.includes(b._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...paginated.map(b => b._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !paginated.map(b => b._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2">Logo</th>
              <th className="px-4 py-2 text-blue-600">Désignation (FR)</th>
              <th className="px-4 py-2">Review (SEO)</th>
              <th className="px-4 py-2">AggregateRating (SEO)</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Date de création</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((brand) => (
              <tr key={brand._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(brand._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, brand._id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== brand._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center">
                    <Image
                      src={
                        // Priority 1: New uploaded images (start with /brands/)
                        brand.logo && brand.logo.startsWith('/brands/')
                          ? brand.logo
                        // Priority 2: HTTP URLs
                        : brand.logo && brand.logo.startsWith('http')
                          ? brand.logo
                        // Priority 3: Old dashboard format (brands/April2025/file.webp)
                        : brand.logo && brand.logo !== ""
                          ? brand.logo.startsWith('/') ? brand.logo : `/dashboard/${brand.logo}`
                        // Fallback: Placeholder
                        : "/images/placeholder.png"
                      }
                      alt={brand.designation_fr || "Logo"}
                      width={48}
                      height={48}
                      className="rounded object-contain border border-gray-200 shadow"
                      style={{ width: 48, height: 48 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/brands/${brand._id}/view`)}>
                  {brand.designation_fr}
                </td>
                <td className="px-4 py-2 max-w-[180px] truncate" title={brand.review || ""}>
                  {brand.review ? (typeof brand.review === 'string' ? brand.review.slice(0, 80) + (brand.review.length > 80 ? '...' : '') : '—') : '—'}
                </td>
                <td className="px-4 py-2 max-w-[120px] truncate" title={brand.aggregateRating || ""}>
                  {brand.aggregateRating || '—'}
                </td>
                <td className="px-4 py-2 max-w-[200px] truncate" title={brand.description_fr || ""}>
                  <div dangerouslySetInnerHTML={{ __html: brand.description_fr ? brand.description_fr.slice(0, 80) + "..." : "" }} />
                </td>
                <td className="px-4 py-2">{brand.created_at ? new Date(brand.created_at).toLocaleDateString() : "-"}</td>
                <td className="px-4 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/brands/${brand._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/brands/${brand._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(brand)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-gray-400">
                  Aucune marque trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Pagination footer */}
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
          Affichage {filtered.length === 0 ? 0 : ((currentPage - 1) * itemsPerPage + 1)} à {filtered.length === 0 ? 0 : Math.min(currentPage * itemsPerPage, filtered.length)} de {filtered.length} entrées
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
