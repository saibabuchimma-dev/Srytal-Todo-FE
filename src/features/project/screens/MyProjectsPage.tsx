import {
  Badge,
  Card,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconCalendar, IconFolder, IconFolders, IconUsers } from '@tabler/icons-react';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import Pagination from '@/shared/ui/Pagination/Pagination';
import { usePagination } from '@/shared/hooks/usePagination';
import { formatDate } from '@/shared/utils/date';
import { useMyProjects } from '../hooks/useProjects';

const statusColors: Record<string, string> = {
  Planning: 'yellow',
  'In Progress': 'blue',
  Completed: 'green',
};

export default function MyProjectsPage() {
  const { page, setPage, limit, setLimit } = usePagination({ initialLimit: 9 });
  const { data: projects = [], isLoading, isError } = useMyProjects();

  const total = projects.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (page > totalPages) {
    setPage(totalPages);
  }
  const pageProjects = projects.slice((page - 1) * limit, page * limit);

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading your projects..." />;
  }

  if (isError) {
    return <CenteredState variant="error" message="Failed to load your projects." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group gap="sm" wrap="nowrap">
          <div
            className="rounded-xl p-3"
            style={{ background: 'var(--app-accent-soft)', color: 'var(--app-accent-fg)' }}
          >
            <IconFolders size={26} />
          </div>
          <div>
            <Title order={2}>My Projects</Title>
            <Text c="dimmed">
              {total} project{total === 1 ? '' : 's'} assigned to you.
            </Text>
          </div>
        </Group>
      </Paper>

      {total === 0 ? (
        <Card withBorder radius="lg">
          <CenteredState
            variant="empty"
            minHeight={220}
            message="You have no projects assigned yet."
          />
        </Card>
      ) : (
        <>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {pageProjects.map((project) => (
              <Card key={project.id} withBorder radius="lg" p="lg">
                <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                  <ThemeIcon variant="light" radius="md" size={42}>
                    <IconFolder size={22} />
                  </ThemeIcon>
                  <div style={{ minWidth: 0 }}>
                    <Text fw={700} lineClamp={1}>
                      {project.name}
                    </Text>
                    <Badge
                      size="sm"
                      mt={4}
                      variant="light"
                      color={statusColors[project.status] ?? 'gray'}
                    >
                      {project.status}
                    </Badge>
                  </div>
                </Group>

                <Text size="sm" c="dimmed" lineClamp={2} mt="md" style={{ minHeight: 40 }}>
                  {project.description}
                </Text>

                <Group gap="lg" mt="md" wrap="wrap">
                  <Group gap={6} wrap="nowrap">
                    <IconCalendar size={15} style={{ color: 'var(--app-text-muted)' }} />
                    <Text size="xs" c="dimmed">
                      {formatDate(project.startDate)} – {formatDate(project.endDate)}
                    </Text>
                  </Group>
                  <Group gap={6} wrap="nowrap">
                    <IconUsers size={15} style={{ color: 'var(--app-text-muted)' }} />
                    <Text size="xs" c="dimmed">
                      {project.members?.length ?? 0} member
                      {(project.members?.length ?? 0) === 1 ? '' : 's'}
                    </Text>
                  </Group>
                </Group>
              </Card>
            ))}
          </SimpleGrid>

          <Stack>
            <Pagination
              page={page}
              total={total}
              limit={limit}
              onPageChange={setPage}
              onLimitChange={setLimit}
            />
          </Stack>
        </>
      )}
    </div>
  );
}
