import {Base} from "./helper";
import {Profile} from "./user";
import {Table} from "./table";

export interface Siswa extends Base, Profile {
  id?: number;
  nis: string;
  siswa_kelas?: SiswaKelas[];
}

export interface SiswaTable extends Table {
  kelas_id?: string;
}

export interface SiswaKelas {
  id: number,
  siswa_id: number,
  kelas_id: number,
}
