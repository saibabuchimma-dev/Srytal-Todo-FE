import { renderHook, act } from '@test-utils';
import { usePagination } from '@/shared/hooks/usePagination';

describe('usePagination', () => {
  it('uses defaults and updates the page', () => {
    const { result } = renderHook(() => usePagination());
    expect(result.current.page).toBe(1);
    expect(result.current.limit).toBe(10);

    act(() => result.current.setPage(3));
    expect(result.current.page).toBe(3);
  });

  it('accepts custom initial values', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 2, initialLimit: 25 }));
    expect(result.current.page).toBe(2);
    expect(result.current.limit).toBe(25);
  });

  it('changing the limit resets to page 1', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 4 }));
    act(() => result.current.setLimit(50));
    expect(result.current.limit).toBe(50);
    expect(result.current.page).toBe(1);
  });

  it('reset returns to the first page', () => {
    const { result } = renderHook(() => usePagination({ initialPage: 5 }));
    act(() => result.current.reset());
    expect(result.current.page).toBe(1);
  });
});
