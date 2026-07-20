import { Alert, Badge, Card, Group, Paper, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import Loader from '@/styles/loader';
import { useMyProjects } from '../hooks/useProjects';

export default function MyProjectsPage() {
  const { data: projects = [], isLoading, isError } = useMyProjects();

  if (isLoading) {
    return <Loader label="Loading your projects..." size={44} />;
  }

  if (isError) {
    return (
      <Alert color="red" radius="md" icon={<IconAlertCircle size={18} />}>
        Failed to load your projects.
      </Alert>
    );
  }

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <Paper withBorder radius="lg" p="lg">
        <Title order={2}>My Projects</Title>
        <Text c="dimmed">Projects assigned to you.</Text>
      </Paper>

      <Stack>
        {projects.length === 0 ? (
          <Card withBorder radius="lg">
            <Text c="dimmed">No projects assigned.</Text>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id} withBorder radius="lg" p="lg">
              <Stack gap="xs">
                <Group justify="space-between">
                  <Title order={4}>{project.name}</Title>

                  <Badge
                    color={
                      project.status === 'Completed'
                        ? 'green'
                        : project.status === 'In Progress'
                          ? 'blue'
                          : 'yellow'
                    }
                  >
                    {project.status}
                  </Badge>
                </Group>

                <Text size="sm" c="dimmed">
                  {project.description}
                </Text>

                <Group gap="xl" mt="sm">
                  <Text size="sm">
                    <strong>Start:</strong> {new Date(project.startDate).toLocaleDateString()}
                  </Text>

                  <Text size="sm">
                    <strong>End:</strong> {new Date(project.endDate).toLocaleDateString()}
                  </Text>
                </Group>
              </Stack>
            </Card>
          ))
        )}
      </Stack>
    </div>
  );
}
