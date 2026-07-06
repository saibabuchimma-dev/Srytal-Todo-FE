import { Alert, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useProjects } from '../hooks/useProjects';

export default function ProjectsPage() {
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
    <Stack gap="lg">
      <Group justify="space-between">
        <div>
          <Title order={2}>Projects</Title>
          <Text c="dimmed">Manage project work aligned with the backend API.</Text>
        </div>
      </Group>

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
    </Stack>
  );
}
