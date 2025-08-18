import BlogEditForm from "@/components/blogs/BlogEditForm";

export default async function BlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BlogEditForm id={id} />;
}
