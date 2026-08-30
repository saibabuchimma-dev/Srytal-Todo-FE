import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
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
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import Pagination from '@/shared/ui/Pagination/Pagination';
import { usePagination } from '@/shared/hooks/usePagination';
import { formatDate } from '@/shared/utils/date';
import { ROUTES } from '@/shared/config/routes';
import ProjectModal from '../components/ProjectModal';
import { useDeleteProject, usePaginatedProjects } from '../hooks/useProjects';
import type { Project } from '../types/project';

const statusColors: Record<string, string> = {
  Planning: 'gray',
  'In Progress': 'blue',
  Completed: 'green',
};

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';

  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebouncedValue(search, 350);
  const { page, setPage, limit, setLimit, reset } = usePagination({ initialLimit: 9 });

  const [modalOpened, setModalOpened] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

  const { data, isLoading, isFetching, isError } = usePaginatedProjects({
    page,
    limit,
    search: debouncedSearch.trim() || undefined,
  });

  const projects = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  if (data && totalPages > 0 && page > totalPages) {
    setPage(totalPages);
  }

  const deleteProjectMutation = useDeleteProject();

  const handleSearch = (value: string) => {
    setSearch(value);
    reset();
  };

  const closeModal = () => {
    setModalOpened(false);
    setEditingProject(null);
  };

  const projectDetailsPath = (projectId: string) =>
    isAdmin ? ROUTES.ADMIN_PROJECT_DETAILS(projectId) : ROUTES.PROJECT_DETAILS(projectId);

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading projects..." />;
  }

  if (isError) {
    return <CenteredState variant="error" message="Projects could not be loaded." />;
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" wrap="wrap" gap="md">
          <Group gap="sm" wrap="nowrap">
            <div
              className="rounded-xl p-3"
              style={{ background: 'var(--app-accent-soft)', color: 'var(--app-accent-fg)' }}
            >
              <IconFolders size={26} />
            </div>
            <div>
              <Title order={2}>{isAdmin ? 'Project Management' : 'My Projects'}</Title>
              <Text c="dimmed">
                {isAdmin ? 'Create, manage and assign projects.' : 'Projects assigned to you.'}
              </Text>
            </div>
          </Group>

          {isAdmin && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                setEditingProject(null);
                setModalOpened(true);
              }}
            >
              Create Project
            </Button>
          )}
        </Group>
      </Paper>

      <Card withBorder radius="lg" p="lg">
        <Stack>
          <Group justify="space-between" wrap="wrap" gap="sm">
            <TextInput
              placeholder="Search projects..."
              leftSection={<IconSearch size={16} />}
              radius="md"
              value={search}
              onChange={(event) => handleSearch(event.currentTarget.value)}
              style={{ flex: '1 1 260px', maxWidth: 360 }}
            />
            <Text size="sm" c="dimmed">
              {total} project{total === 1 ? '' : 's'}
            </Text>
          </Group>

          <Divider />

          {projects.length === 0 ? (
            <CenteredState
              variant="empty"
              minHeight={220}
              message={debouncedSearch ? 'No projects match your search.' : 'No projects yet.'}
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  withBorder
                  radius="lg"
                  p="lg"
                  className="cursor-pointer"
                  onClick={() => navigate(projectDetailsPath(project.id))}
                >
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
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

                    {isAdmin && (
                      <Menu position="bottom-end" width={160} shadow="md" radius="md">
                        <Menu.Target>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            aria-label="Project actions"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <IconDotsVertical size={18} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<IconEdit size={16} />}
                            onClick={(event) => {
                              event.stopPropagation();
                              setEditingProject(project);
                              setModalOpened(true);
                            }}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            color="red"
                            leftSection={<IconTrash size={16} />}
                            onClick={(event) => {
                              event.stopPropagation();
                              setDeletingProject(project);
                              setDeleteOpened(true);
                            }}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
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

                  <Divider my="md" />

                  <Group justify="space-between" align="center">
                    <Text size="sm" fw={600} style={{ color: 'var(--app-accent)' }}>
                      View details
                    </Text>
                    <IconArrowRight size={16} style={{ color: 'var(--app-accent)' }} />
                  </Group>
                </Card>
              ))}
            </SimpleGrid>
          )}

          <Pagination
            page={page}
            total={total}
            limit={limit}
            onPageChange={setPage}
            onLimitChange={setLimit}
            loading={isFetching}
          />
        </Stack>
      </Card>

      <ProjectModal
        opened={modalOpened}
        onClose={closeModal}
        mode={editingProject ? 'edit' : 'create'}
        project={editingProject ?? undefined}
      />

      <ConfirmDeleteModal
        opened={deleteOpened}
        loading={deleteProjectMutation.isPending}
        title="Delete Project"
        message={`Are you sure you want to delete "${deletingProject?.name ?? ''}"?`}
        onClose={() => {
          setDeleteOpened(false);
          setDeletingProject(null);
        }}
        onConfirm={() => {
          if (!deletingProject) return;

          deleteProjectMutation.mutate(deletingProject.id, {
            onSuccess: () => {
              setDeleteOpened(false);
              setDeletingProject(null);
            },
          });
        }}
      />
    </div>
  );
}
