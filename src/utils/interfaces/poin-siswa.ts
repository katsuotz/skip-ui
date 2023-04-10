import {Base} from "./helper";
import {JurusanPoin} from "./jurusan";
import {KelasPoin} from "./kelas";

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

export interface PoinJurusanWithKelas {
  jurusan: JurusanPoin,
  data: KelasPoin[];
}
