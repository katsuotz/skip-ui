import {Base} from "./helper";
import {Table} from "./table";

export interface DataPoin extends Base {
  id?: number;
  title: string;
  description: string;
  poin?: number;
  type: string;
  category: string;
}

export interface DataPoinTable extends Table {
  type?: string;
  category?: string;
}
