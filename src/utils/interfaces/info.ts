import {Table} from "./table";

export interface InfoListTable extends Table {
  tahun_ajar_id?: string;
  group_by?: string;
  type?: string;
}

export interface InfoListData {
  nis: string;
  nama: string;
  nama_kelas: string;
  poin: number;
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
