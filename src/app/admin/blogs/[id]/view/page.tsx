import BlogViewClient from "@/components/blogs/BlogViewClient";

export default function BlogViewPage({ params }: { params: { id: string } }) {
  return <BlogViewClient id={params.id} />;
}
