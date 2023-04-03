export interface Any {
  [key: string]: any;
}

export interface Option {
  value: any;
  label: string;
}

export type UploadType =
  | "xlsx"
  | "pdf"
  | "img"
  | "pdf_img";

export interface Base {
  created_at?: string;
  updated_at?: string;
}
