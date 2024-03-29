import {Table} from "./table";

export interface InfoListTable extends Table {
  tahun_ajar_id?: string;
  group_by?: string;
  type?: string;
  max_poin?: number;
}

export interface InfoListData {
  nis: string;
  nama: string;
  nama_kelas: string;
  poin: number;
  foto?: string;
}

export interface InfoListDataCount {
  title: string;
  type: string;
  total: number;
}

export interface InfoGraphCount {
  month: number;
  year: number;
  total: number;
}
