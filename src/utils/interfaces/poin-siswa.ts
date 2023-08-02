import {Base} from "./helper";
import {JurusanPoin} from "./jurusan";
import {KelasPoin} from "./kelas";

export interface PoinSiswaRequest {
  title: string;
  description: string;
  penanganan: string;
  poin: number;
  type: string;
  siswa_kelas_id: number;
  data_poin_id: number;
  file: string;
}

export interface PoinSiswa extends Base {
  nis: string;
  nama: string;
  nama_kelas: string;
  poin: number;
  foto?: string;
}

export interface PoinJurusanWithKelas {
  jurusan: JurusanPoin,
  data: KelasPoin[];
}
