import { getBlogs } from "../services/blog.service";
import { Blog } from "../types/blog";

export const fetchAllBlogs = async (): Promise<Blog[]> => {
  return await getBlogs();
};