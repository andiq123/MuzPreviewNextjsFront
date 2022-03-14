export type PaginatedResult<T> = {
  items: T;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
};
