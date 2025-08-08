import BlogEditForm from "@/components/blogs/BlogEditForm";

export default function BlogEditPage({ params }: { params: { id: string } }) {
  return <BlogEditForm id={params.id} />;
}
