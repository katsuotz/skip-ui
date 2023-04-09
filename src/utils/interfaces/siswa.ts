import {Base} from "./helper";
import {Profile} from "./user";
import {Table} from "./table";

export interface Siswa extends Base, Profile {
  id?: number;
  nis: string;
  siswa_kelas?: SiswaKelas[];
  siswa_kelas_id?: number;
  poin?: number;
}

export interface SiswaTable extends Table {
  kelas_id?: string;
  jurusan_id?: string;
  tahun_ajar_id?: string;
  tahun_ajar_active?: boolean;
}

export interface SiswaKelas {
  id: number,
  siswa_id: number,
  kelas_id: number,
}
