"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/types/product";
import { fetchAllProducts, ProductListResponse } from "@/utils/fetchProducts";
import { fetchSubcategories } from "@/utils/fetchSubcategories";
import { SubCategory } from "@/types/subcategory";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { deleteProduct as deleteProductAPI } from "@/services/products";
import { getProductImageWithFallback } from "@/utils/imageUtils";

const defaultItemsPerPage = 10;

export default function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);
  const [subcategories, setSubcategories] = useState<SubCategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchAllProducts(currentPage, itemsPerPage)
      .then((res: ProductListResponse) => {
        if (!ignore) {
          setProducts(res.products);
          setTotalProducts(res.pagination.total);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    return () => { ignore = true; };
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    fetchSubcategories().then(setSubcategories).catch(console.error);
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = products.filter((p) =>
    (p.title || p.designation_fr || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const paginated = search ? filtered : products;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + paginated.length, totalProducts);
  const totalPages = totalProducts === 0 ? 0 : Math.ceil(totalProducts / itemsPerPage);

  const handleDelete = (product: Product) => {
    setDeleteProduct(product);
  };

  const handleConfirmDelete = async () => {
    if (!deleteProduct) return;
    try {
      await deleteProductAPI(deleteProduct._id);
      setProducts(prev => prev.filter(p => p._id !== deleteProduct._id));
      setTotalProducts(prev => prev - 1);
      setDeleteProduct(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Erreur lors de la suppression du produit');
    }
  };



  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteProduct?.designation_fr || deleteProduct?.title || deleteProduct?.designation}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={async () => {
          try {
            await Promise.all(selectedIds.map(id => deleteProductAPI(id)));
            setProducts((prev) => prev.filter(p => !selectedIds.includes(p._id)));
            setTotalProducts(prev => prev - selectedIds.length);
            setSelectedIds([]);
            setDeleteSelectionOpen(false);
          } catch (error) {
            console.error('Error deleting products:', error);
            alert('Erreur lors de la suppression des produits');
          }
        }}
        productName={selectedIds.length === 1
          ? (products.find(p => p._id === selectedIds[0])?.designation_fr || products.find(p => p._id === selectedIds[0])?.title || products.find(p => p._id === selectedIds[0])?.designation)
          : `${selectedIds.length} produits`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Produits</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/produits/new')}
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

      {/* Search */}
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
                  checked={selectedIds.length > 0 && paginated.every(p => selectedIds.includes(p._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...paginated.map(p => p._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !paginated.map(p => p._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">Désignation</th>
              <th className="px-4 py-2">Couverture</th>
              <th className="px-4 py-2">sous-catégories</th>
              <th className="px-2 py-2">Qte</th>
              <th className="px-2 py-2">Prix</th>
              <th className="px-2 py-2">Promo</th>
              <th className="px-2 py-2">Publier</th>
              <th className="px-2 py-2">Pack</th>
              <th className="px-2 py-2">New Product</th>
              <th className="px-2 py-2">Etat de stock</th>
              <th className="px-2 py-2">Meilleures ventes</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {paginated.map((product) => (
              <tr key={product._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, product._id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== product._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer">
                  {product.title || product.designation_fr}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center">
                    <img
                      src={(() => {
                        const { src, fallback } = getProductImageWithFallback(product);
                        return src;
                      })()}
                      alt="cover"
                      width={100}
                      height={100}
                      className="rounded object-contain border border-gray-200 shadow"
                      style={{ width: 100, height: 100 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        const { fallback } = getProductImageWithFallback(product);
                        if (fallback && target.src !== fallback) {
                          target.src = fallback;
                        } else {
                          target.src = "/images/placeholder.png";
                        }
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2">
                  {Array.isArray(product.subCategory) && product.subCategory.length > 0
                    ? product.subCategory.map((sc: string | { _id: string; designation: string; }) => {
                        if (typeof sc === 'string') {
                          const found = subcategories.find(sub => sub._id === sc || sub.id === sc);
                          return found ? (found.designation_fr || found.designation || found.name || found.slug) : sc;
                        }
                        return (sc as { designation_fr?: string; designation?: string; name?: string; title?: string; slug?: string })?.designation_fr || (sc as { designation_fr?: string; designation?: string; name?: string; title?: string; slug?: string })?.designation || (sc as { designation_fr?: string; designation?: string; name?: string; title?: string; slug?: string })?.name || (sc as { designation_fr?: string; designation?: string; name?: string; title?: string; slug?: string })?.title || (sc as { designation_fr?: string; designation?: string; name?: string; title?: string; slug?: string })?.slug || '';
                      }).join(', ')
                    : typeof product.subCategory === 'string' && product.subCategory
                    ? (() => {
                        const subCategoryId = product.subCategory as string;
                        const found = subcategories.find(sub => sub._id === subCategoryId || sub.id === subCategoryId);
                        return found ? (found.designation_fr || found.designation || found.name || found.slug) : subCategoryId;
                      })()
                    : product.sous_categorie_id
                    ? (() => {
                        const found = subcategories.find(sub => sub._id === product.sous_categorie_id || sub.id === product.sous_categorie_id);
                        return found ? (found.designation_fr || found.designation || found.name || found.slug) : product.sous_categorie_id;
                      })()
                    : '—'}
                </td>
                <td className="px-2 py-2">{product.qte ?? product.quantity ?? '—'}</td>
                <td className="px-2 py-2">{product.prix ?? product.price ?? '—'}</td>
                <td className="px-2 py-2">{product.promo ?? "—"}</td>
                <td className="px-2 py-2">
                  <span className="text-white bg-teal-500 text-xs px-2 py-1 rounded">Publier</span>
                </td>
                <td className="px-2 py-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-200 text-blue-700">Non</span>
                </td>
                <td className="px-2 py-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-200 text-blue-700">Non</span>
                </td>
                <td className="px-2 py-2">
                  <span className="text-xs px-2 py-1 rounded bg-green-200 text-green-700">En Stock</span>
                </td>
                <td className="px-2 py-2">
                  <span className="text-xs px-2 py-1 rounded bg-blue-200 text-blue-700">Non</span>
                </td>
                <td className="px-2 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/produits/${product._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/produits/${product._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(product)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={13} className="px-4 py-6 text-center text-gray-400">
                  Aucun produit trouvé.
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
          Affichage {totalProducts === 0 ? 0 : (startIndex + 1)} à {totalProducts === 0 ? 0 : Math.min(startIndex + paginated.length, totalProducts)} de {totalProducts} entrées
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