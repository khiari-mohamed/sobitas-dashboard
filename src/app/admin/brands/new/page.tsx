"use client";
import { useRouter } from "next/navigation";
import { createBrand } from "@/utils/brands";
import { useState } from "react";
import BrandCreateEditForm from "@/components/brands/BrandCreateEditForm";
import { Brand } from "@/types/brand";

export default function BrandCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (brand: Partial<Brand>, logoFile?: File | null) => {
    setLoading(true);
    try {
      await createBrand(brand, logoFile);
      router.push("/admin/brands");
    } catch (error) {
      console.error('Error creating brand:', error);
      alert('Erreur lors de la création de la marque');
    } finally {
      setLoading(false);
    }
  };

  return <BrandCreateEditForm mode="add" onSubmit={handleSubmit} loading={loading} />;
}
