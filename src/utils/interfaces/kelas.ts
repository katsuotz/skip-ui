import {Base} from "./helper";

export interface Kelas extends Base {
  id: number;
  nama_kelas: string;
  jurusan_id: number;
  tahun_ajar_id: number;
  guru_id: number;
}

export interface KelasRequest extends Base {
  id: number;
  nama_kelas: string;
  jurusan_id: string;
  tahun_ajar_id: string;
  guru_id: string;
}

export interface KelasResponse extends Kelas {
  nama: string;
  nip: string;
  tipe_guru: string;
  tahun_ajar?: string;
}
