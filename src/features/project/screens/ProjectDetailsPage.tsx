import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Alert,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Loader,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconChecklist,
  IconClockHour4,
  IconPencil,
  IconPlus,
  IconProgress,
  IconUsers,
} from '@tabler/icons-react';
import { useEmployeeProjectTasks, useProjectDetails } from '../hooks/useProjects';
import ProjectModal from '../components/ProjectModal';
import TaskModal from '@/features/task/components/CreateTaskModal';

export default function ProjectDetailsPage() {
  const { projectId = '' } = useParams();
  const [taskOpened, setTaskOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const { data, isLoading, isError, refetch } = useProjectDetails(projectId);
  const { data: employeeTasks = [], refetch: refetchEmployeeTasks } = useEmployeeProjectTasks(
    projectId,
    selectedEmployeeId,
  );

  if (isLoading) {
    return (
      <Group justify="center" py={60}>
        <Loader />
      </Group>
    );
  }

  if (isError || !data) {
    return (
      <Alert color="red" icon={<IconAlertCircle size={18} />}>
        Unable to load project details.
      </Alert>
    );
  }

  return (
    <>
      <Stack>
        <Paper withBorder p="lg" radius="md">
          <Group justify="space-between" align="flex-start">
            <div>
              <Title order={2}>{data.project.name}</Title>
              <Text mt={6} c="dimmed">
                {data.project.description}
              </Text>
              <Group mt="lg">
                <Text fw={600}>Status:</Text>
                <Text>{data.project.status}</Text>
                <Text fw={600}>Start:</Text>
                <Text>{new Date(data.project.startDate).toLocaleDateString()}</Text>
                <Text fw={600}>End:</Text>
                <Text>{new Date(data.project.endDate).toLocaleDateString()}</Text>
              </Group>
            </div>

            <Group>
              <Button
                variant="default"
                leftSection={<IconPencil size={16} />}
                onClick={() => setEditOpened(true)}
              >
                Edit Project
              </Button>

              <Button leftSection={<IconPlus size={16} />} onClick={() => setTaskOpened(true)}>
                Add Task
              </Button>
            </Group>
          </Group>
        </Paper>

        <SimpleGrid cols={{ base: 2, md: 4 }}>
          <Card withBorder>
            <Stack align="center" gap={5}>
              <ThemeIcon color="blue" size="lg">
                <IconUsers size={20} />
              </ThemeIcon>
              <Text fw={700}>{data.employees.length}</Text>
              <Text size="sm" c="dimmed">
                Team Members
              </Text>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack align="center" gap={5}>
              <ThemeIcon color="green" size="lg">
                <IconChecklist size={20} />
              </ThemeIcon>
              <Text fw={700}>{data.stats.totalTasks}</Text>
              <Text size="sm" c="dimmed">
                Total Tasks
              </Text>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack align="center" gap={5}>
              <ThemeIcon color="yellow" size="lg">
                <IconProgress size={20} />
              </ThemeIcon>
              <Text fw={700}>{data.stats.inProgress}</Text>
              <Text size="sm" c="dimmed">
                In Progress
              </Text>
            </Stack>
          </Card>

          <Card withBorder>
            <Stack align="center" gap={5}>
              <ThemeIcon color="red" size="lg">
                <IconClockHour4 size={20} />
              </ThemeIcon>
              <Text fw={700}>{data.stats.pending}</Text>
              <Text size="sm" c="dimmed">
                Pending
              </Text>
            </Stack>
          </Card>
        </SimpleGrid>

        <Grid>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Card withBorder h={600}>
              <Title order={4}>Team Members</Title>
              <Stack mt="md">
                {data.employees.length === 0 && <Text c="dimmed">No members assigned.</Text>}
                {data.employees.map((member) => {
                  const selected = selectedEmployeeId === member.employee._id;
                  return (
                    <Card
                      key={member.employee._id}
                      withBorder
                      p="sm"
                      radius="md"
                      style={{
                        cursor: 'pointer',
                        borderColor: selected ? '#4c6ef5' : undefined,
                      }}
                      onClick={() => setSelectedEmployeeId(member.employee._id)}
                    >
                      <Group justify="space-between">
                        <Group>
                          <Avatar radius="xl" src={member.employee.avatar}>
                            {member.employee.fullName.charAt(0)}
                          </Avatar>
                          <div>
                            <Text fw={600}>{member.employee.fullName}</Text>
                            <Text size="xs" c="dimmed">
                              {member.employee.email}
                            </Text>
                          </div>
                        </Group>
                        <Badge>{member.taskCount}</Badge>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            </Card>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 8 }}>
            <Card withBorder h={600}>
              <Title order={4}>Employee Tasks</Title>
              <Stack mt="md">
                {!selectedEmployeeId && (
                  <Text c="dimmed">Select an employee to view assigned tasks.</Text>
                )}
                {selectedEmployeeId && employeeTasks.length === 0 && (
                  <Text c="dimmed">No tasks assigned.</Text>
                )}
                {employeeTasks.map((task) => (
                  <Card key={task._id} withBorder radius="md">
                    <Stack gap={6}>
                      <Group justify="space-between">
                        <Text fw={600}>{task.title}</Text>
                        <Badge
                          color={
                            task.status === 'Completed'
                              ? 'green'
                              : task.status === 'In Progress'
                                ? 'blue'
                                : 'gray'
                          }
                        >
                          {task.status}
                        </Badge>
                      </Group>
                      <Text size="sm">{task.description}</Text>
                      <Divider />
                      <Group justify="space-between">
                        <Badge color="orange">{task.priority}</Badge>
                        <Text size="xs">Due : {new Date(task.dueDate).toLocaleDateString()}</Text>
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
      <ProjectModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        mode="edit"
        project={data.project}
      />

      <TaskModal
        opened={taskOpened}
        onClose={() => setTaskOpened(false)}
        projectId={projectId}
        onSuccess={() => {
          refetch();
          if (selectedEmployeeId) {
            refetchEmployeeTasks();
          }
        }}
      />
    </>
  );
}
