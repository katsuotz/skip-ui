import {Base} from "./helper";
import {Profile} from "./user";

export interface Guru extends Base, Profile {
  id?: number;
  nip: string;
  tipe_guru: string;
  username?: string;
  password?: string;
}
