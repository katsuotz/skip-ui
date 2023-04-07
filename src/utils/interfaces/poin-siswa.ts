import {Base} from "./helper";

export interface PoinSiswaRequest {
  title: string;
  description: string;
  poin: number;
  type: string;
  siswa_kelas_id: number;
}

export interface PoinSiswa extends Base {
  nis: string;
  nama: string;
  nama_kelas: string;
  poin: number;
}
