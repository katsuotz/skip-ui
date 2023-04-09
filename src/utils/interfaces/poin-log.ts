import {Base} from "./helper";
import {Table} from "./table";
import {Kelas, KelasResponse} from "./kelas";

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
  nis?: string;
  nama?: string;
  nama_kelas?: string;
  foto?: string;
}

export interface PoinLogTable extends Table {
  siswa_kelas_id?: string;
  tahun_ajar_id?: string;
}

export interface PoinLogWithKelas {
  kelas: KelasResponse;
  data: PoinLog[];
}
