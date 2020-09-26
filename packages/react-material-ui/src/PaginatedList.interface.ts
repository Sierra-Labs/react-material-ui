export interface PaginatedList<T> {
  total: number;
  data: T[];
  page?: number;
  limit?: number;
}
