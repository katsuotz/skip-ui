import {Base} from "./helper";
import {Table} from "./table";
import {Kelas} from "./kelas";

export interface PoinLog extends Base {
  id: number;
  poin: number;
  poin_before: number;
  poin_after: number;
  title: string;
  description: string;
  penanganan: string;
  tindak_lanjut?: string;
  type: string;
  pegawai_id: number;
  nip: string;
  nama_pegawai: string;
  nis?: string;
  nama?: string;
  nama_kelas?: string;
  foto?: string;
  file?: string;
}

export interface PoinLogTable extends Table {
  siswa_kelas_id?: string;
  tahun_ajar_id?: string;
}

export interface PoinWithKelas extends Kelas {
  poin: number;
  tahun_ajar: string;
  wali_kelas: string;
}

export interface PoinLogWithKelas {
  kelas: PoinWithKelas;
  data: PoinLog[];
}
