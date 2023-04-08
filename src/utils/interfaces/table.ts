import {Any} from "./helper";

export interface Table {
  page: number;
  per_page: number;
  search?: string;
  order?: string;
  order_by?: string;
}

export interface Payload extends Table, Any {
}

export interface Pagination {
  page: number;
  total_item: number;
  total_page: number;
  per_page: number;
}
