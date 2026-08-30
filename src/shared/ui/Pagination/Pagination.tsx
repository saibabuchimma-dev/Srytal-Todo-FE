import { Group, Pagination as MantinePagination, Select, Text } from '@mantine/core';

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  /** When provided, renders a page-size selector. */
  onLimitChange?: (limit: number) => void;
  pageSizeOptions?: number[];
  /** Shown while the query is fetching a new page (keeps controls interactive). */
  loading?: boolean;
}

/**
 * Reusable pagination footer: "Showing X–Y of Z", an optional rows-per-page
 * selector, and page controls. Renders nothing when there are no items.
 */
export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
  onLimitChange,
  pageSizeOptions = [10, 20, 50],
  loading = false,
}: PaginationProps) {
  if (total === 0) {
    return null;
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <Group justify="space-between" align="center" wrap="wrap" gap="sm" mt="md">
      <Text size="sm" c="dimmed">
        Showing {from}–{to} of {total}
      </Text>

      <Group gap="sm" wrap="nowrap">
        {onLimitChange && (
          <Select
            size="xs"
            w={120}
            aria-label="Rows per page"
            allowDeselect={false}
            data={pageSizeOptions.map((size) => ({ value: String(size), label: `${size} / page` }))}
            value={String(limit)}
            onChange={(value) => value && onLimitChange(Number(value))}
          />
        )}

        <MantinePagination
          total={totalPages}
          value={page}
          onChange={onPageChange}
          size="sm"
          radius="md"
          withEdges
          disabled={loading}
        />
      </Group>
    </Group>
  );
}
