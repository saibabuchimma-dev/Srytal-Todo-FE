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
      {onLimitChange && (
        <Group gap="xs" wrap="nowrap">
          <Text size="xs" c="dimmed">
            Per page:
          </Text>
          <Select
            size="xs"
            w={76}
            value={String(limit)}
            onChange={(val) => onLimitChange(Number(val) || 10)}
            data={['5', '10', '20', '50']}
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
