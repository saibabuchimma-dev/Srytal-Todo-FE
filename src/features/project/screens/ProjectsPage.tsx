import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebouncedValue } from '@mantine/hooks';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Menu,
  Paper,
  Select,
  SimpleGrid,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  Tooltip,
} from '@mantine/core';
import {
  IconArrowRight,
  IconCalendar,
  IconDotsVertical,
  IconEdit,
  IconFolder,
  IconFolders,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { usePagination } from '@/shared/hooks/usePagination';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import { Pagination } from '@/shared/ui/Pagination/Pagination';
import { CardSkeleton } from '@/shared/ui/Skeleton/Skeleton';
import { formatDate } from '@/shared/utils/date';
import { ROUTES } from '@/shared/config/routes';
import ProjectModal from '../components/ProjectModal';
import { useDeleteProject, usePaginatedProjects } from '../hooks/useProjects';
import type { Project, ProjectStatus } from '../types/project';

const STATUS_META: Record<string, { color: string; label: string }> = {
  Planning: { color: 'yellow', label: 'Planning' },
  'In Progress': { color: 'blue', label: 'In Progress' },
  Completed: { color: 'teal', label: 'Completed' },
};

function ProjectCard({
  project,
  isAdmin,
  onEdit,
  onDelete,
  onView,
}: {
  project: Project;
  isAdmin: boolean;
  onEdit: (p: Project) => void;
  onDelete: (p: Project) => void;
  onView: (p: Project) => void;
}) {
  const meta = STATUS_META[project.status] ?? {
    color: 'gray',
    label: project.status,
  };
  const totalMembers = project.members?.length ?? 0;

  return (
    <Card
      withBorder
      radius="lg"
      p="lg"
      className="card-lift cursor-pointer"
      onClick={() => onView(project)}
      style={{
        backgroundColor: 'var(--app-surface)',
        borderColor: 'var(--app-border)',
        boxShadow: 'var(--app-shadow-card)',
        borderLeft: `4px solid var(--mantine-color-${meta.color}-6)`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
      }}
    >
      <div>
        <Group justify="space-between" align="flex-start" wrap="nowrap" mb="sm">
          <Group gap="sm" wrap="nowrap" style={{ minWidth: 0, flex: 1 }}>
            <ThemeIcon variant="light" radius="md" size={38} color={meta.color}>
              <IconFolder size={20} />
            </ThemeIcon>
            <div style={{ minWidth: 0, flex: 1 }}>
              <Text fw={700} lineClamp={1} size="sm" c="var(--app-text)">
                {project.name}
              </Text>
              <Badge size="xs" mt={2} variant="light" color={meta.color}>
                {meta.label}
              </Badge>
            </div>
          </Group>

          {isAdmin && (
            <Tooltip label="Project options" withArrow>
              <Menu position="bottom-end" width={150} shadow="md" radius="md">
                <Menu.Target>
                  <ActionIcon
                    variant="subtle"
                    color="gray"
                    size="sm"
                    aria-label="Project actions"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <IconDotsVertical size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      onEdit(project);
                    }}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={(event) => {
                      event.stopPropagation();
                      onDelete(project);
                    }}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Tooltip>
          )}
        </Group>

        <Text
          size="xs"
          c="dimmed"
          lineClamp={2}
          style={{ minHeight: 36, lineHeight: 1.5 }}
        >
          {project.description || 'No description provided.'}
        </Text>

        <Group gap="md" mt="md" wrap="wrap">
          <Group gap={4} wrap="nowrap">
            <IconCalendar
              size={13}
              style={{ color: 'var(--app-text-muted)' }}
            />
            <Text size="xs" c="dimmed">
              {formatDate(project.startDate)} – {formatDate(project.endDate)}
            </Text>
          </Group>
          <Group gap={4} wrap="nowrap">
            <IconUsers size={13} style={{ color: 'var(--app-text-muted)' }} />
            <Text size="xs" c="dimmed">
              {totalMembers} member{totalMembers === 1 ? '' : 's'}
            </Text>
          </Group>
        </Group>
      </div>

      <div>
        <Divider my="sm" style={{ borderColor: 'var(--app-border)' }} />
        <Group justify="space-between" align="center">
          <Text size="xs" fw={600} style={{ color: 'var(--app-primary)' }}>
            View project &amp; tasks
          </Text>
          <IconArrowRight size={14} style={{ color: 'var(--app-primary)' }} />
        </Group>
      </div>
    </Card>
  );
}

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 300);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { page, setPage, limit, setLimit, reset } = usePagination({
    initialLimit: 9,
  });

  const [createOpened, setCreateOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { data, isLoading, isError } = usePaginatedProjects({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
    status:
      statusFilter !== 'all' ? (statusFilter as ProjectStatus) : undefined,
  });

  const deleteMutation = useDeleteProject();

  const projects = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (data && totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const handleSearch = (value: string) => {
    setSearch(value);
    reset();
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setEditOpened(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteOpened(true);
  };

  const handleView = (project: Project) => {
    navigate(
      isAdmin
        ? ROUTES.ADMIN_PROJECT_DETAILS(project.id)
        : ROUTES.PROJECT_DETAILS(project.id),
    );
  };

  const confirmDelete = () => {
    if (!selectedProject) return;

    deleteMutation.mutate(selectedProject.id, {
      onSuccess: () => {
        setDeleteOpened(false);
        setSelectedProject(null);
      },
    });
  };

  if (isLoading) {
    return (
      <div
        role="status"
        aria-label="Loading"
        className="mx-auto flex max-w-7xl flex-col gap-6"
      >
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </SimpleGrid>
      </div>
    );
  }

  if (isError) {
    return (
      <CenteredState variant="error" message="Projects could not be loaded." />
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 animate-in">
      <Paper
        radius="lg"
        p="lg"
        style={{
          backgroundColor: 'var(--app-surface)',
          border: '1px solid var(--app-border)',
          boxShadow: 'var(--app-shadow-card)',
        }}
      >
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="sm" wrap="nowrap">
            <div
              style={{
                padding: 10,
                borderRadius: 12,
                background: 'var(--app-accent-soft)',
                color: 'var(--app-accent-fg)',
              }}
            >
              <IconFolders size={24} />
            </div>
            <div>
              <Title order={2} fw={800} fz={22}>
                {isAdmin ? 'Project Management' : 'My Projects'}
              </Title>
              <Text c="dimmed" size="xs">
                Organize team members, assign tasks, and track high-level
                roadmaps.
              </Text>
            </div>
          </Group>

          {isAdmin && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => setCreateOpened(true)}
              w={{ base: '100%', sm: 'auto' }}
              style={{
                background: 'var(--app-brand-gradient)',
                color: 'var(--app-brand-on)',
                fontWeight: 600,
              }}
            >
              Create Project
            </Button>
          )}
        </Group>
      </Paper>

      <Card
        withBorder
        radius="lg"
        p="md"
        style={{
          backgroundColor: 'var(--app-surface)',
          borderColor: 'var(--app-border)',
          boxShadow: 'var(--app-shadow-card)',
        }}
      >
        <Grid align="center" gap="sm">
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
            <TextInput
              placeholder="Search projects..."
              leftSection={<IconSearch size={16} />}
              radius="md"
              size="sm"
              value={search}
              onChange={(e) => handleSearch(e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
            <Select
              placeholder="Filter by Status"
              radius="md"
              size="sm"
              data={[
                { value: 'all', label: 'All Statuses' },
                { value: 'Planning', label: 'Planning' },
                { value: 'In Progress', label: 'In Progress' },
                { value: 'Completed', label: 'Completed' },
              ]}
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val ?? 'all');
                reset();
              }}
            />
          </Grid.Col>
        </Grid>
      </Card>

      {projects.length === 0 ? (
        <CenteredState
          variant="empty"
          message="No projects found matching your criteria."
          minHeight={240}
        />
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isAdmin={isAdmin}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </SimpleGrid>
      )}

      <Pagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
        onLimitChange={setLimit}
      />

      {isAdmin && (
        <>
          <ProjectModal
            opened={createOpened}
            onClose={() => setCreateOpened(false)}
          />
          <ProjectModal
            opened={editOpened}
            project={selectedProject ?? undefined}
            onClose={() => {
              setEditOpened(false);
              setSelectedProject(null);
            }}
          />
          <ConfirmDeleteModal
            opened={deleteOpened}
            onClose={() => {
              setDeleteOpened(false);
              setSelectedProject(null);
            }}
            onConfirm={confirmDelete}
            loading={deleteMutation.isPending}
            title="Delete Project"
            message={`Are you sure you want to delete "${selectedProject?.name ?? ''}"? All related project tasks will be affected.`}
          />
        </>
      )}
    </div>
  );
}
