"use client";
import { useParams } from "next/navigation";
import BrandViewClient from "@/components/brands/BrandViewClient";

export default function BrandViewPage() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  if (!id) return <div className="px-2 sm:px-6 lg:px-12 py-8">Chargement...</div>;
  return <BrandViewClient id={id as string} />;
}
