import { useCallback, useState } from 'react';

interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

/**
 * Reusable page/limit state for any paginated list.
 * Changing the page size (or calling reset) returns to the first page.
 */
export function usePagination({ initialPage = 1, initialLimit = 10 }: UsePaginationOptions = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);

  const setLimit = useCallback((next: number) => {
    setLimitState(next);
    setPage(1);
  }, []);

  const reset = useCallback(() => setPage(1), []);

  return { page, setPage, limit, setLimit, reset };
}
