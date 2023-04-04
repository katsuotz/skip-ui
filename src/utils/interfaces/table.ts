import {Any} from "./helper";

export interface Table {
  page: number;
  per_page: number;
  search?: string;
}

export interface Payload extends Table, Any {
}

export interface Pagination {
  page: number;
  total_item: number;
  total_page: number;
  per_page: number;
}
