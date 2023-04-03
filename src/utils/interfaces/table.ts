import {Any} from "./helper";

export interface Table {
  page: number;
  per_page: number;
  search?: string;
}

export  interface Payload extends Table, Any {
  select?: string;
  [key: string]: any;
}

export interface Pagination {
  page:number;
  total_item:number;
  total_page:number;
  per_page:number;
}
