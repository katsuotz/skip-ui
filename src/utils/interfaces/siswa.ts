import {Base} from "./helper";
import {Profile} from "./user";

export interface Siswa extends Base, Profile {
  id?: number;
  nis: string;
}
