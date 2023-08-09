import {Base} from "./helper";

export interface Sync extends Base {
  id: number;
  type: string;
  status: string;
  description: boolean;
}
