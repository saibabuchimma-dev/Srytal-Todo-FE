/** Standard shape for a paginated API response, normalized on the client. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/** Common query params sent to paginated list endpoints. */
export interface PaginationParams {
  page: number;
  limit: number;
  search?: string;
}
