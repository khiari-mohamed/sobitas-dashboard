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

// Blog configuration API calls
export const fetchBlogConfig = async () => {
  try {
    const res = await axios.get("/blog/config");
    return res.data;
  } catch (error) {
    console.error("Error fetching blog config:", error);
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('blogConfig');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  }
};

export const saveBlogConfig = async (config: { sectionTitle: string; sectionDescription: string; maxDisplay: number; showOnFrontend: boolean; blogOrder: string[] }) => {
  try {
    const res = await axios.post("/blog/config", config);
    return res.data;
  } catch (error) {
    console.error("Error saving blog config:", error);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blogConfig', JSON.stringify(config));
      window.dispatchEvent(new CustomEvent('blogConfigChanged', { detail: config }));
    }
    return { success: true, data: config };
  }
};