import {
  Group,
  Pagination as MantinePagination,
  Select,
  Text,
} from '@mantine/core';

export interface CustomPaginationProps {
  page?: number;
  total?: number;
  limit?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onLimitChange?: (limit: number) => void;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  value?: number;
  onChange?: (value: number) => void;
}

export function Pagination({
  page = 1,
  total = 0,
  limit = 10,
  totalPages,
  onPageChange,
  onLimitChange,
  loading,
  value,
  onChange,
  className,
  style,
}: CustomPaginationProps) {
  const currentPage = value ?? page;
  const numPages =
    totalPages ?? Math.max(1, Math.ceil(total / Math.max(1, limit)));

  const start = total === 0 ? 0 : (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);

  const handleChange = (p: number) => {
    if (onPageChange) onPageChange(p);
    if (onChange) onChange(p);
  };

  return (
    <Group
      justify="space-between"
      align="center"
      wrap="wrap"
      gap="sm"
      className={className}
      style={style}
    >
      <Group gap="sm" wrap="nowrap">
        {total > 0 && (
          <Text size="xs" c="dimmed">
            Showing {start}–{end} of {total}
          </Text>
        )}
        {onLimitChange && (
          <Group gap="xs" wrap="nowrap">
            <Text size="xs" c="dimmed">
              Per page:
            </Text>
            <Select
              size="xs"
              w={110}
              value={String(limit)}
              onChange={(val) => onLimitChange(Number(val) || 10)}
              data={[
                { value: '5', label: '5 / page' },
                { value: '10', label: '10 / page' },
                { value: '20', label: '20 / page' },
                { value: '50', label: '50 / page' },
              ]}
              disabled={loading}
              styles={{
                input: {
                  borderRadius: 8,
                  fontSize: 12,
                },
              }}
            />
          </Group>
        )}
      </Group>

      <MantinePagination
        value={currentPage}
        onChange={handleChange}
        total={numPages}
        size="sm"
        radius="md"
        disabled={loading}
        styles={{
          control: {
            borderColor: 'var(--app-border)',
            backgroundColor: 'var(--app-surface)',
            borderRadius: 8,
            minWidth: 32,
            height: 32,
            fontSize: 13,
            fontWeight: 500,
          },
        }}
      />
    </Group>
  );
}

export default Pagination;
