import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import {
  IconAlertCircle,
  IconArrowRight,
  IconEdit,
  IconFolders,
  IconTrash,
} from '@tabler/icons-react';
import { modals } from '@mantine/modals';
import { useAuthStore } from '@/features/auth/store/auth.store';
import ProjectModal from '../components/ProjectModal';
import { useDeleteProject, useProjects } from '../hooks/useProjects';
import type { Project } from '../types/project';

export default function ProjectsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';
  const [opened, setOpened] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const { data = [], isLoading, isError } = useProjects();
  const deleteProjectMutation = useDeleteProject();
  const closeModal = () => {
    setOpened(false);
    setEditingProject(null);
  };
  const projectDetailsPath = (projectId: string) =>
    isAdmin
      ? `/admin/dashboard/projects/${projectId}/details`
      : `/dashboard/projects/${projectId}/details`;

  const handleDelete = (project: Project) => {
    modals.openConfirmModal({
      title: 'Delete Project',
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete <strong>{project.name}</strong>?
        </Text>
      ),

      labels: {
        confirm: 'Delete',
        cancel: 'Cancel',
      },

      confirmProps: {
        color: 'red',
      },

      onConfirm: () => deleteProjectMutation.mutate(project.id),
    });
  };

  if (isLoading) {
    return <Text c="dimmed">Loading projects...</Text>;
  }

  if (isError) {
    return (
      <Alert color="red" radius="md" icon={<IconAlertCircle size={18} />}>
        Projects could not be loaded.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between">
          <div>
            <Title order={2}>{isAdmin ? 'Project Management' : 'My Projects'}</Title>
            <Text c="dimmed" mt="xs">
              {isAdmin ? 'Create, manage and assign projects.' : 'Projects assigned to you.'}
            </Text>
          </div>
          <div className="rounded-full bg-violet-50 p-3 text-violet-600">
            <IconFolders size={24} />
          </div>
        </Group>
      </Paper>

      {isAdmin && (
        <Group justify="flex-end">
          <Button
            onClick={() => {
              setEditingProject(null);
              setOpened(true);
            }}
          >
            Create Project
          </Button>
        </Group>
      )}

      {data.length === 0 ? (
        <Alert color="gray">No projects found.</Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          {data.map((project) => (
            <Card key={project.id} withBorder radius="md" shadow="sm">
              <Stack>
                <Group justify="space-between">
                  <Title order={5}>{project.name}</Title>
                  <Text size="sm" c="dimmed">
                    {project.status}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {project.description}
                </Text>
                <Text size="xs" c="dimmed">
                  {new Date(project.startDate).toLocaleDateString()} -{' '}
                  {new Date(project.endDate).toLocaleDateString()}
                </Text>

                <Group justify="space-between" mt="md">
                  <Button
                    variant="light"
                    rightSection={<IconArrowRight size={16} />}
                    onClick={() => navigate(projectDetailsPath(project.id))}
                  >
                    Open
                  </Button>
                  {isAdmin && (
                    <Group>
                      <Button
                        variant="light"
                        color="blue"
                        leftSection={<IconEdit size={16} />}
                        onClick={() => {
                          setEditingProject(project);
                          setOpened(true);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        color="red"
                        variant="light"
                        leftSection={<IconTrash size={16} />}
                        loading={deleteProjectMutation.isPending}
                        onClick={() => handleDelete(project)}
                      >
                        Delete
                      </Button>
                    </Group>
                  )}
                </Group>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <ProjectModal
        opened={opened}
        onClose={closeModal}
        mode={editingProject ? 'edit' : 'create'}
        project={editingProject ?? undefined}
      />
    </div>
  );
}
