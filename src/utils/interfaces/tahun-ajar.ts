import {Base} from "./helper";

export interface TahunAjar extends Base {
  id: number;
  tahun_ajar: string;
  is_active?: boolean;
}
