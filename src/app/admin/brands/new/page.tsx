"use client";
import { useRouter } from "next/navigation";
import { createBrand } from "@/utils/brands";
import { useState } from "react";
import BrandCreateEditForm from "@/components/brands/BrandCreateEditForm";

export default function BrandCreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (brand: any, logoFile?: File | null) => {
    setLoading(true);
    try {
      // If you want to handle logo upload, do it here
      await createBrand(brand);
      router.push("/admin/brands");
    } finally {
      setLoading(false);
    }
  };

  return <BrandCreateEditForm mode="add" onSubmit={handleSubmit} loading={loading} />;
}
