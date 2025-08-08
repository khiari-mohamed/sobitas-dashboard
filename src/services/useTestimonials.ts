import { useEffect, useState } from "react";
import { Testimonial } from "@/types/testimonial";
import testimonialsData from "./../components/Home/Testimonials/testimonialsData";

interface ReviewApiResponse {
  comment: string | null;
  user?: {
    name: string;
    role: string;
    img: string;
  };
}

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function useTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchTestimonials() {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/reviews?publishedOnly=true`);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();

        let mapped: Testimonial[] = [];
        if (Array.isArray(data) && data.length > 0) {
          mapped = data
            .filter((t: any) => t.comment && t.comment.trim() !== "") // Only reviews with comments
            .map((review: any) => ({
              review: review.comment,
              authorName: review.user?.name || "Utilisateur",
              authorRole: review.user?.role || "",
              authorImg: review.user?.avatar || "",
              stars: review.stars || "5",
            }));
        }

        if (isMounted) {
          setTestimonials(mapped);
        }
      } catch (e) {
        if (isMounted) setTestimonials([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchTestimonials();
    return () => {
      isMounted = false;
    };
  }, []);

  return { testimonials, loading };
}
