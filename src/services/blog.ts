import axios from "@/lib/axios";
import { Blog } from "@/types/blog";

// Fetch all blogs
export const fetchAllBlogs = async (): Promise<Blog[]> => {
  try {
    const res = await axios.get("/blogs/get/all");
    console.log("API Response:", res.data);
    
    // Handle different response structures
    if (Array.isArray(res.data)) {
      return res.data as Blog[];
    }
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data as Blog[];
    }
    if (res.data?.blogs && Array.isArray(res.data.blogs)) {
      return res.data.blogs as Blog[];
    }
    
    console.log("No blogs found in response");
    return [];
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return [];
  }
};

// Update a blog
export const updateBlog = async (id: string, payload: Partial<Blog>) => {
  const res = await axios.put(`/blogs/update/${id}`, payload);
  return res.data;
};

// Delete a blog
export const deleteBlog = async (id: string) => {
  const res = await axios.delete(`/blogs/delete/${id}`);
  return res.data;
};