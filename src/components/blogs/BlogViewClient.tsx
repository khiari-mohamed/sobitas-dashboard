"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import { getBlogs } from "@/services/blog.service";
import { getBlogImageWithFallback } from "@/utils/imageUtils";

function renderHTML(html: string | null | undefined) {
  if (!html) return <span className="text-gray-400">—</span>;
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function Divider() {
  return <hr className="my-6 border-gray-200" />;
}

export default function BlogViewClient({ id }: { id: string }) {
  const [blog, setBlog] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    setLoading(true);
    getBlogs().then((blogs) => {
      const foundBlog = blogs.find((b) => b._id === id);
      setBlog(foundBlog ? foundBlog as unknown as Record<string, unknown> : null);
      setLoading(false);
    });
  }, [id]);

  const handleDelete = () => {
    setShowDelete(false);
    // TODO: Replace with real delete logic
    alert("Blog supprimé (placeholder)");
  };

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>;
  }

  if (!blog) {
    return <div className="text-center py-12 text-red-500">Aucun blog trouvé.</div>;
  }

  const { src: coverUrl, fallback: coverFallback } = getBlogImageWithFallback(blog);

  return (
    <div className="bg-white p-8 shadow-xl w-full max-w-[1600px] mx-auto">
      {/* Top Buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Link
          href={`/admin/blogs/${id}/edit`}
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
          href="/admin/blogs"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded flex items-center gap-2 text-base"
        >
          <FaArrowLeft /> Retourner à la liste
        </Link>
      </div>
      <ConfirmDeleteModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        productName={String(blog.title || blog.designation_fr || 'Blog')}
      />
      {/* Désignation */}
      <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Désignation</h2>
      <div className="text-2xl text-gray-900 mb-6 font-semibold">{String(blog.designation_fr || blog.title || "—")}</div>
      <Divider />
      {/* Couverture */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Couverture</h3>
      <div className="flex flex-col items-center mb-6">
        <div className="flex items-center justify-center" style={{ width: 660, height: 660 }}>
          <img
            src={coverUrl}
            alt={String(blog.title || blog.designation_fr || "Blog image")}
            width={660}
            height={660}
            className="object-contain border w-full h-full"
            style={{ maxWidth: 660, maxHeight: 660 }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (coverFallback && target.src !== coverFallback) {
                target.src = coverFallback;
              } else {
                target.src = "/images/placeholder.png";
              }
            }}
          />
        </div>
      </div>
      <Divider />
      {/* Description */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Description</h3>
      <div className="mb-6 text-lg leading-relaxed bg-gray-50 border p-4">
        {renderHTML(String(blog.description || ''))}
      </div>
      <Divider />
      {/* Publier */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Publié</h3>
      <div className="mb-6 text-lg">
        {blog.publier === "1" ? (
          <span className="text-white bg-teal-500 text-xs px-2 py-1">Oui</span>
        ) : (
          <span className="text-xs px-2 py-1 bg-blue-200 text-blue-700">Non</span>
        )}
      </div>
      <Divider />
      {/* Slug */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Slug</h3>
      <div className="mb-6 text-lg">{String(blog.slug ?? "—")}</div>
      <Divider />
      {/* Alt Cover (SEO) */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Alt Cover (SEO)</h3>
      <div className="mb-6 text-lg">{String(blog.alt_cover ?? "—")}</div>
      <Divider />
      {/* Description Cover (SEO) */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Description Cover (SEO)</h3>
      <div className="mb-6 text-lg">{String(blog.description_cover ?? "—")}</div>
      <Divider />
      {/* Meta */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Meta ( name;content/name;content/name;content......)</h3>
      <div className="mb-6 text-lg leading-relaxed bg-gray-50 border p-4">
        {renderHTML(String(blog.meta || ''))}
      </div>
      <Divider />
      {/* Schema description (seo) */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Schema description (seo)</h3>
      <div className="mb-6 text-lg leading-relaxed bg-gray-50 border p-4">
        {renderHTML(String(blog.content_seo || ''))}
      </div>
      <Divider />
      {/* Review (seo) */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Review (seo)</h3>
      <div className="mb-6 text-lg">{String(blog.review ?? "—")}</div>
      <Divider />
      {/* AggregateRating (seo) */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">AggregateRating (seo)</h3>
      <div className="mb-6 text-lg">{String(blog.aggregateRating ?? "—")}</div>
      <Divider />
      {/* Dates */}
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Créé le</h3>
      <div className="mb-6 text-lg">{String(blog.createdAt || blog.created_at || "—")}</div>
      <Divider />
      <h3 className="text-2xl font-bold text-gray-700 mb-3">Modifié le</h3>
      <div className="mb-6 text-lg">{String(blog.updatedAt || blog.updated_at || "—")}</div>
    </div>
  );
}
