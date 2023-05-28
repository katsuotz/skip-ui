import {Base} from "./helper";

export interface Kelas extends Base {
  id: number;
  nama_kelas: string;
  jurusan_id: number;
  tahun_ajar_id: number;
  pegawai_id: number;
}

export interface KelasRequest extends Base {
  id: number;
  nama_kelas: string;
  jurusan_id: string;
  tahun_ajar_id: string;
  pegawai_id: string;
}

export interface KelasResponse extends Kelas {
  nama: string;
  nip: string;
  tipe_pegawai: string;
  tahun_ajar?: string;
}

export interface KelasPoin {
  nama_kelas: string;
  tahun_ajaran: string;
  poin: number;
}
