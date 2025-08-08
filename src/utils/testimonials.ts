import { Testimonial } from "@/types/testimonial";

/** Fetch all testimonials */
export async function getAllTestimonials(): Promise<Testimonial[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/reviews`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to fetch testimonials");
  const data = await res.json();
  return Array.isArray(data)
  ? data.map((t: any) => ({
      review: t.comment,
      authorName: t.user?.name || "Anonyme",
      authorRole: t.user?.role || "",
      authorImg: t.user?.img || "/images/default-user.png",
      _id: t._id || t.id || undefined,
    }))
  : [];
}

/** Add a new testimonial */
export async function addTestimonial(testimonial: Testimonial): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      comment: testimonial.review,
      user: {
        name: testimonial.authorName,
        role: testimonial.authorRole,
        img: testimonial.authorImg,
      },
      publier: 1,
    }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to add testimonial");
  }
}

/** Approve a testimonial */
export async function approveTestimonial(id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/reviews/${id}/approve`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ publier: 1 }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to approve testimonial");
  }
}

/** Delete a testimonial */
export async function deleteTestimonial(id: string): Promise<void> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/reviews/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.message || "Failed to delete testimonial");
  }
}
