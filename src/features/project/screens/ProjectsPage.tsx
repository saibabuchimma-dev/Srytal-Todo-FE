import { Alert, Button, Card, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle, IconFolders } from '@tabler/icons-react';
import { useState } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import ProjectModal from '../components/ProjectModal';
import { useProjects } from '../hooks/useProjects';

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'Admin';
  const [opened, setOpened] = useState(false);
  const { data = [], isError, isLoading } = useProjects();

  if (isLoading) {
    return <Text c="dimmed">Loading projects...</Text>;
  }

  if (isError) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />} radius="md">
        Projects could not be loaded.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper radius="lg" p="lg" withBorder>
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>{isAdmin ? 'Project Management' : 'My Projects'}</Title>
            <Text c="dimmed" mt="xs">
              {isAdmin
                ? 'Create and review projects across the organization.'
                : 'Review the projects assigned to you.'}
            </Text>
          </div>
          <div className="rounded-full bg-violet-50 p-3 text-violet-600">
            <IconFolders size={24} />
          </div>
        </Group>
      </Paper>

      {isAdmin ? (
        <Group justify="flex-end">
          <Button onClick={() => setOpened(true)}>Create Project</Button>
        </Group>
      ) : null}

      {data.length === 0 ? (
        <Alert color="gray" radius="md">
          No projects found yet.
        </Alert>
      ) : (
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {data.map((project) => (
            <Card key={project.id} withBorder radius="md" shadow="sm">
              <Stack gap={6}>
                <Group justify="space-between">
                  <Text fw={700}>{project.name}</Text>
                  <Text size="sm" c="dimmed">
                    {project.status}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed">
                  {project.description}
                </Text>
                <Text size="xs" c="dimmed">
                  {project.startDate} → {project.endDate}
                </Text>
              </Stack>
            </Card>
          ))}
        </SimpleGrid>
      )}

      <ProjectModal opened={opened} onClose={() => setOpened(false)} />
    </div>
  );
}
