import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/blogs`;

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  cover?: { url: string; img_id?: string } | string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  created_at?: string; // Support snake_case from DB
  updated_at?: string;
  id?: string;
  designation_fr?: string;
  description?: string;
  publier?: string;
  meta_description_fr?: string;
  alt_cover?: string;
  description_cover?: string;
  meta?: string;
  content_seo?: string;
  review?: string | null;
  aggregateRating?: string | null;
  author?: string;
  author_role?: string;
}

// Helper to normalize date fields to camelCase
function normalizeBlog(blog: any): Blog {
  return {
    ...blog,
    createdAt: blog.createdAt || blog.created_at,
    updatedAt: blog.updatedAt || blog.updated_at,
  };
}

export const getBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await axios.get(`${API_URL}/get/all`);
    // Normalize each blog object
    return Array.isArray(response.data)
      ? response.data.map(normalizeBlog)
      : [];
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return [];
  }
};

export const getLandingPageBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await axios.get(`${API_URL}/get-all-landing-page`);
    return Array.isArray(response.data)
      ? response.data.map(normalizeBlog)
      : [];
  } catch (error) {
    console.error('Error fetching landing page blogs:', error);
    return [];
  }
};

export const getBlogBySlug = async (slug: string): Promise<Blog | null> => {
  try {
    const response = await axios.get(`${API_URL}/slug/${slug}`);
    return response.data ? normalizeBlog(response.data) : null;
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  }
};

export const createBlog = async (payload: any, isFormData = false) => {
  if (isFormData) {
    const response = await axios.post(`${API_URL}/new`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const response = await axios.post(`${API_URL}/new`, payload);
    return response.data;
  }
};

export const updateBlog = async (id: string, payload: any, isFormData = false) => {
  if (isFormData) {
    const response = await axios.put(`${API_URL}/update/${id}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } else {
    const response = await axios.put(`${API_URL}/update/${id}`, payload);
    return response.data;
  }
};

export const deleteBlog = async (id: string) => {
  const response = await axios.delete(`${API_URL}/delete/${id}`);
  return response.data;
};