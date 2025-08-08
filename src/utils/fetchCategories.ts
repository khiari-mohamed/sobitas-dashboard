import axiosInstance from "@/lib/axios";
import type { Category } from "@/types/category";

export async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await axiosInstance.get("/categories");
    const data = res.data?.categories || [];
    return data.map((cat: any) => ({
      _id: cat._id,
      slug: cat.slug || "",
      designation: cat.designation,
      designation_fr: cat.designation_fr,
      title: cat.title,
    }));
  } catch (err) {
    console.error("fetchCategories error:", err);
    return [];
  }
}