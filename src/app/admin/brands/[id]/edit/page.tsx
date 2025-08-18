"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchBrandById, updateBrand } from "@/utils/brands";
import BrandCreateEditForm from "@/components/brands/BrandCreateEditForm";
import { Brand } from "@/types/brand";

export default function BrandEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [brand, setBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchBrandById(id as string)
      .then(setBrand)
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (updatedBrand: Partial<Brand>) => {
    if (!id) return;
    setSaving(true);
    try {
      await updateBrand(id as string, updatedBrand);
      router.push("/admin/brands");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="px-2 sm:px-6 lg:px-12 py-8">Chargement...</div>;
  if (!brand) return <div className="px-2 sm:px-6 lg:px-12 py-8 text-red-500">Marque introuvable.</div>;

  return <BrandCreateEditForm mode="edit" initialBrand={brand} onSubmit={handleSubmit} loading={saving} />;
}
