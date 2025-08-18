import BlogViewClient from "@/components/blogs/BlogViewClient";

export default async function BlogViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogViewClient id={id} />;
}
