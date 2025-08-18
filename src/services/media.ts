import axiosInstance from '../lib/axios';
import { Media, Folder, Attachment } from '../types/media';


// Folder endpoints
const FOLDER_RESOURCE = '/folders';
const MEDIA_RESOURCE = '/media';
const FILE_UPLOAD_RESOURCE = '/file-upload';

// Folders
export const fetchFolders = async (parentId?: string): Promise<Folder[]> => {
  const params = parentId ? { parentId } : undefined;
  const { data } = await axiosInstance.get<Folder[]>(FOLDER_RESOURCE, { params });
  return data;
};

export const fetchFolderTree = async (): Promise<Folder[]> => {
  const { data } = await axiosInstance.get<Folder[]>(`${FOLDER_RESOURCE}/tree`);
  return data;
};

export const createFolder = async (folder: Partial<Folder>): Promise<Folder> => {
  const { data } = await axiosInstance.post<Folder>(FOLDER_RESOURCE, folder);
  return data;
};

export const updateFolder = async (id: string, update: Partial<Folder>): Promise<Folder> => {
  const { data } = await axiosInstance.patch<Folder>(`${FOLDER_RESOURCE}/${id}`, update);
  return data;
};

export const deleteFolder = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${FOLDER_RESOURCE}/${id}`);
};

// Media
export const fetchMedia = async (page = 1, limit = 10): Promise<{ data: Media[]; page: number; limit: number; total: number; totalPages: number }> => {
  const params = { page, limit };
  const { data } = await axiosInstance.get(`${MEDIA_RESOURCE}`, { params });
  return data;
};

export const fetchMediaByFolder = async (folderId: string): Promise<Media[]> => {
  const { data } = await axiosInstance.get<Media[]>(`${MEDIA_RESOURCE}/by-folder/${folderId}`);
  return data;
};

export const fetchMediaMetadata = async (mediaId: string): Promise<Partial<Media>> => {
  const { data } = await axiosInstance.get<Partial<Media>>(`${MEDIA_RESOURCE}/${mediaId}`);
  return data;
};

export const updateMedia = async (mediaId: string, update: Partial<Media>): Promise<Media> => {
  const { data } = await axiosInstance.patch<Media>(`${MEDIA_RESOURCE}/${mediaId}`, update);
  return data;
};

//uplod

export const deleteMedia = async (mediaId: string): Promise<void> => {
  await axiosInstance.delete(`${MEDIA_RESOURCE}/${mediaId}`);
};


export const uploadFile = async (file: File, folderId?: string): Promise<Attachment> => {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId) formData.append('folderId', folderId);

  // Log FormData entries (for debugging)
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  const response = await axiosInstance.post(FILE_UPLOAD_RESOURCE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Download
export const downloadFile = (filename: string): void => {
  window.open(`${FILE_UPLOAD_RESOURCE}/download/${filename}`, '_blank');
};

const mediaService = {
  fetchFolders,
  fetchFolderTree,
  createFolder,
  updateFolder,
  deleteFolder,
  fetchMedia,
  fetchMediaByFolder,
  fetchMediaMetadata,
  updateMedia,
  deleteMedia,
  uploadFile,
  downloadFile,
};

export default mediaService;
