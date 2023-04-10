import {Base} from "./helper";

export interface Jurusan extends Base {
  id: number;
  nama_jurusan: string;
}

export interface JurusanPoin extends Jurusan {
  poin: number;
  tahun_ajar: string;
}
