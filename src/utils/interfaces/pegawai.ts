import {Base} from "./helper";
import {Profile} from "./user";

export interface Pegawai extends Base, Profile {
  id?: number;
  nip: string;
  tipe_pegawai: string;
  username?: string;
  password?: string;
}
