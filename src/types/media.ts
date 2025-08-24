export interface Media {
  id: string;
  width: number | null;
  height: number | null;
  fileSize: number;
  folderId?: string | null;
  url?: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  children?: Folder[];
  images?: string[]; // or Media[] if you want full objects
}

export interface Attachment {
  filename: string;
  mimetype: string;
  size: number;
  url: string;
}
