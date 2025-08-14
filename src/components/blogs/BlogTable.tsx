"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blog";
import { fetchAllBlogs } from "@/utils/fetchBlogs";
import { FaSearch } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";

const defaultItemsPerPage = 10;

export default function BlogTable() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage);
  const [deleteBlog, setDeleteBlog] = useState<Blog | null>(null);
  const [deleteSelectionOpen, setDeleteSelectionOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchAllBlogs()
      .then(setBlogs)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filtered = blogs.filter((b) =>
    (b.title || b.designation_fr || "").toLowerCase().includes(search.toLowerCase())
  );

  const paginated = search ? filtered : blogs;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, paginated.length);
  const currentBlogs = paginated.slice(startIndex, endIndex);
  const totalPages = paginated.length === 0 ? 0 : Math.ceil(paginated.length / itemsPerPage);

  const handleDelete = (blog: Blog) => {
    setDeleteBlog(blog);
  };

  const handleConfirmDelete = async () => {
    if (deleteBlog) {
      try {
        const { deleteBlog: deleteBlogService } = await import('@/services/blog.service');
        await deleteBlogService(deleteBlog._id);
        setBlogs((prev) => prev.filter(b => b._id !== deleteBlog._id));
        setSelectedIds((prev) => prev.filter(id => id !== deleteBlog._id));
      } catch (error) {
        console.error('Error deleting blog:', error);
        alert('Erreur lors de la suppression du blog');
      }
    }
    setDeleteBlog(null);
  };

  const handleBulkDelete = async () => {
    try {
      const { deleteBlog: deleteBlogService } = await import('@/services/blog.service');
      for (const id of selectedIds) {
        await deleteBlogService(id);
      }
      setBlogs((prev) => prev.filter(b => !selectedIds.includes(b._id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Error deleting blogs:', error);
      alert('Erreur lors de la suppression des blogs');
    }
    setDeleteSelectionOpen(false);
  };

  return (
    <div className="bg-white rounded shadow-sm p-4 w-full max-w-[1800px] mx-auto">
      <ConfirmDeleteModal
        open={!!deleteBlog}
        onClose={() => setDeleteBlog(null)}
        onConfirm={handleConfirmDelete}
        productName={deleteBlog?.title || deleteBlog?.designation_fr}
      />
      <ConfirmDeleteModal
        open={deleteSelectionOpen}
        onClose={() => setDeleteSelectionOpen(false)}
        onConfirm={handleBulkDelete}
        productName={selectedIds.length === 1
          ? (blogs.find(b => b._id === selectedIds[0])?.title || blogs.find(b => b._id === selectedIds[0])?.designation_fr)
          : `${selectedIds.length} blogs`}
      />
      <div className="flex flex-col sm:flex-row gap-3 mb-4 items-start sm:items-center">
        <h2 className="text-xl font-semibold text-gray-700">Blogs</h2>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded"
            onClick={() => router.push('/admin/blogs/new')}
          >
            + Ajouter un blog
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
      {/* Search Bar Only */}
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
                  checked={selectedIds.length > 0 && currentBlogs.every(b => selectedIds.includes(b._id))}
                  onChange={e => {
                    if (e.target.checked) {
                      setSelectedIds(Array.from(new Set([...selectedIds, ...currentBlogs.map(b => b._id)])));
                    } else {
                      setSelectedIds(selectedIds.filter(id => !currentBlogs.map(b => b._id).includes(id)));
                    }
                  }}
                />
              </th>
              <th className="px-4 py-2 text-blue-600">designation_fr</th>
              <th className="px-4 py-2">Couverture</th>
              <th className="px-4 py-2">Review (SEO)</th>
              <th className="px-4 py-2">AggregateRating (SEO)</th>
              <th className="px-4 py-2">Publié</th>
              <th className="px-4 py-2">Créé le</th>
              <th className="px-4 py-2">Modifié le</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {currentBlogs.map((blog) => (
              <tr key={blog._id}>
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(blog._id)}
                    onChange={e => {
                      if (e.target.checked) {
                        setSelectedIds(prev => [...prev, blog._id]);
                      } else {
                        setSelectedIds(prev => prev.filter(id => id !== blog._id));
                      }
                    }}
                  />
                </td>
                <td className="px-4 py-2 text-blue-600 underline cursor-pointer" onClick={() => router.push(`/admin/blogs/${blog._id}/view`)}>
                  {blog.title || blog.designation_fr}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center items-center">
                    <Image
                      src={
                        // Priority 1: New uploaded images (start with /blogs/)
                        typeof blog.cover === "string" && blog.cover.startsWith('/blogs/')
                          ? blog.cover
                        // Priority 2: Object format with URL
                        : typeof blog.cover === "object" && blog.cover?.url
                          ? blog.cover.url.startsWith("http") ? blog.cover.url : blog.cover.url
                        // Priority 3: Old uploads format (articles/February2025/file.webp)
                        : typeof blog.cover === "string" && blog.cover !== ""
                          ? blog.cover.startsWith('/') ? blog.cover : `/uploads/${blog.cover}`
                        // Fallback: Placeholder
                        : "/images/placeholder.png"
                      }
                      alt="cover"
                      width={100}
                      height={100}
                      className="rounded object-contain border border-gray-200 shadow"
                      style={{ width: 100, height: 100 }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/images/placeholder.png";
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-2">{blog.review ?? "—"}</td>
                <td className="px-4 py-2">{blog.aggregateRating ?? "—"}</td>
                <td className="px-4 py-2">
                  {blog.publier === "1" ? (
                    <span className="text-white bg-teal-500 text-xs px-2 py-1 rounded">Oui</span>
                  ) : (
                    <span className="text-xs px-2 py-1 rounded bg-blue-200 text-blue-700">Non</span>
                  )}
                </td>
                <td className="px-4 py-2">{blog.createdAt || blog.created_at}</td>
                <td className="px-4 py-2">{blog.updatedAt || blog.updated_at}</td>
                <td className="px-2 py-2 space-x-1">
                  <button
                    className="bg-yellow-400 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/blogs/${blog._id}/view`)}
                  >
                    👁 Vue
                  </button>
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => router.push(`/admin/blogs/${blog._id}/edit`)}
                  >
                    ✏️ Éditer
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleDelete(blog)}
                  >
                    🗑 Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {currentBlogs.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-400">
                  Aucun blog trouvé.
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
          Affichage {paginated.length === 0 ? 0 : (startIndex + 1)} à {paginated.length === 0 ? 0 : Math.min(endIndex, paginated.length)} de {paginated.length} entrées
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
