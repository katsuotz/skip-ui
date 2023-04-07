import {Base} from "./helper";
import {Table} from "./table";

export interface PoinLog extends Base {
  id: number;
  poin: number;
  poin_before: number;
  poin_after: number;
  title: string;
  description: string;
  type: string;
  guru_id: number;
  nip: string;
  nama_guru: string;
}

export interface PoinLogTable extends Table {
  siswa_kelas_id: string;
}

export interface SiswaKelas {
  id: number,
  siswa_id: number,
  kelas_id: number,
}
