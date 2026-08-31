import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Grid,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconCalendar,
  IconChecklist,
  IconCircleCheck,
  IconFolder,
  IconPencil,
  IconPlus,
  IconProgress,
  IconUsers,
} from '@tabler/icons-react';
import { useEmployeeProjectTasks, useProjectDetails } from '../hooks/useProjects';
import ProjectModal from '../components/ProjectModal';
import ProjectTasksTable from '../components/ProjectTasksTable';
import TaskModal from '@/features/task/components/CreateTaskModal';
import TaskDetailsModal from '@/features/task/components/TaskDetailsModal';
import StatsCard from '@/features/dashboard/components/StatsCard';
import type { ProjectTask } from '../types/project';
import { useDeleteTask } from '@/features/task/hooks/useTasks';
import type { Task } from '@/features/task/types/task';
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal';
import BackButton from '@/shared/ui/BackButton/BackButton';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import { formatDate } from '@/shared/utils/date';

const statusColors: Record<string, string> = {
  Planning: 'gray',
  'In Progress': 'blue',
  Completed: 'green',
};

const taskStatusColors: Record<string, string> = {
  Pending: 'yellow',
  'In Progress': 'blue',
  Completed: 'green',
};

const priorityColors: Record<string, string> = {
  Low: 'green',
  Medium: 'yellow',
  High: 'red',
};

export default function ProjectDetailsPage() {
  const { projectId = '' } = useParams();
  const [taskOpened, setTaskOpened] = useState(false);
  const [editOpened, setEditOpened] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [viewOpened, setViewOpened] = useState(false);
  const [editTaskOpened, setEditTaskOpened] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { data, isLoading, isError, refetch } = useProjectDetails(projectId);
  const { data: employeeTasks = [], refetch: refetchEmployeeTasks } = useEmployeeProjectTasks(
    projectId,
    selectedEmployeeId,
  );
  const deleteTaskMutation = useDeleteTask();
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const mapProjectTaskToTask = (task: ProjectTask): Task => ({
    id: task._id,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    assignedTo: task.assignedTo?._id ?? '',
    assignedEmployee: task.assignedTo
      ? {
          id: task.assignedTo._id,
          fullName: task.assignedTo.fullName,
        }
      : undefined,
    project: projectId,
    projectDetails: data
      ? {
          id: projectId,
          name: data.project.name,
        }
      : undefined,
    createdAt: task.createdAt,
    updatedAt: task.createdAt,
  });

  if (isLoading) {
    return <CenteredState variant="loading" label="Loading project..." />;
  }

  if (isError || !data) {
    return <CenteredState variant="error" message="Unable to load project details." />;
  }

  const { project, stats, employees, tasks } = data;
  const completion = stats.totalTasks
    ? Math.round((stats.completed / stats.totalTasks) * 100)
    : 0;
  const selectedMember = employees.find((member) => member.employee._id === selectedEmployeeId);

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6">
      <BackButton label="Back to Projects" />

      <Paper withBorder radius="lg" p="lg">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Group gap="md" wrap="nowrap" style={{ minWidth: 0 }}>
            <ThemeIcon variant="light" size={56} radius="md">
              <IconFolder size={28} />
            </ThemeIcon>
            <div style={{ minWidth: 0 }}>
              <Group gap="sm" wrap="nowrap">
                <Title order={2} lineClamp={1}>
                  {project.name}
                </Title>
                <Badge variant="light" color={statusColors[project.status] ?? 'gray'}>
                  {project.status}
                </Badge>
              </Group>

              <Text c="dimmed" mt={4} lineClamp={2}>
                {project.description}
              </Text>

              <Group gap="lg" mt="sm" wrap="wrap">
                <Group gap={6} wrap="nowrap">
                  <IconCalendar size={15} style={{ color: 'var(--app-text-muted)' }} />
                  <Text size="xs" c="dimmed">
                    {formatDate(project.startDate)} – {formatDate(project.endDate)}
                  </Text>
                </Group>
                <Group gap={6} wrap="nowrap">
                  <IconUsers size={15} style={{ color: 'var(--app-text-muted)' }} />
                  <Text size="xs" c="dimmed">
                    {employees.length} member{employees.length === 1 ? '' : 's'}
                  </Text>
                </Group>
              </Group>
            </div>
          </Group>

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

        <Divider my="lg" />

        <Group justify="space-between" mb={6}>
          <Text size="sm" fw={600}>
            Progress
          </Text>
          <Text size="sm" c="dimmed">
            {stats.completed}/{stats.totalTasks} tasks completed · {completion}%
          </Text>
        </Group>
        <Progress value={completion} color="green" radius="xl" size="md" />
      </Paper>

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <StatsCard
          label="Team Members"
          value={employees.length}
          icon={<IconUsers size={24} />}
          accent="var(--app-primary)"
        />
        <StatsCard
          label="Total Tasks"
          value={stats.totalTasks}
          icon={<IconChecklist size={24} />}
          accent="var(--app-accent)"
        />
        <StatsCard
          label="In Progress"
          value={stats.inProgress}
          icon={<IconProgress size={24} />}
          accent="var(--app-chart-in-progress)"
        />
        <StatsCard
          label="Completed"
          value={stats.completed}
          icon={<IconCircleCheck size={24} />}
          accent="var(--app-success)"
        />
      </SimpleGrid>

      <Card withBorder radius="lg" p="lg">
        <Group justify="space-between" mb="md">
          <Title order={4}>Tasks</Title>
          <Button
            size="xs"
            variant="light"
            leftSection={<IconPlus size={14} />}
            onClick={() => setTaskOpened(true)}
          >
            Add Task
          </Button>
        </Group>

        {tasks.length === 0 ? (
          <CenteredState variant="empty" minHeight={180} message="No tasks in this project yet." />
        ) : (
          <ProjectTasksTable
            tasks={tasks}
            onView={(task) => {
              setSelectedTask(task);
              setViewOpened(true);
            }}
            onEdit={(task) => {
              setEditingTask(mapProjectTaskToTask(task));
              setEditTaskOpened(true);
            }}
            onDelete={(task) => {
              setDeletingTask(mapProjectTaskToTask(task));
              setDeleteOpened(true);
            }}
          />
        )}
      </Card>

      <Grid>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Card withBorder radius="lg" p="lg">
            <Title order={4} mb="md">
              Team Members
            </Title>

            {employees.length === 0 ? (
              <Text c="dimmed" size="sm">
                No members assigned.
              </Text>
            ) : (
              <Stack gap="sm">
                {employees.map((member) => {
                  const selected = selectedEmployeeId === member.employee._id;
                  return (
                    <Card
                      key={member.employee._id}
                      withBorder
                      p="sm"
                      radius="md"
                      className="cursor-pointer"
                      style={
                        selected
                          ? {
                              borderColor: 'var(--app-primary)',
                              background: 'var(--app-accent-soft)',
                            }
                          : undefined
                      }
                      onClick={() => setSelectedEmployeeId(member.employee._id)}
                    >
                      <Group justify="space-between" wrap="nowrap">
                        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
                          <Avatar radius="xl" src={member.employee.avatar || undefined} color="blue">
                            {member.employee.fullName.charAt(0).toUpperCase()}
                          </Avatar>
                          <div style={{ minWidth: 0 }}>
                            <Text fw={600} size="sm" lineClamp={1}>
                              {member.employee.fullName}
                            </Text>
                            <Text size="xs" c="dimmed" lineClamp={1}>
                              {member.employee.email}
                            </Text>
                          </div>
                        </Group>
                        <Badge variant="light" radius="sm">
                          {member.taskCount}
                        </Badge>
                      </Group>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Card withBorder radius="lg" p="lg">
            <Title order={4} mb="md">
              {selectedMember ? `${selectedMember.employee.fullName}'s Tasks` : 'Employee Tasks'}
            </Title>

            {!selectedEmployeeId ? (
              <CenteredState
                variant="empty"
                minHeight={200}
                message="Select a team member to view their assigned tasks."
              />
            ) : employeeTasks.length === 0 ? (
              <CenteredState
                variant="empty"
                minHeight={200}
                message="No tasks assigned to this member."
              />
            ) : (
              <Stack gap="sm">
                {employeeTasks.map((task) => (
                  <Card
                    key={task._id}
                    withBorder
                    radius="md"
                    p="md"
                    style={{
                      borderLeft: `3px solid var(--mantine-color-${
                        priorityColors[task.priority] ?? 'gray'
                      }-6)`,
                    }}
                  >
                    <Stack gap={6}>
                      <Group justify="space-between" align="flex-start" wrap="nowrap">
                        <Text fw={600} size="sm" lineClamp={1}>
                          {task.title}
                        </Text>
                        <Badge
                          size="sm"
                          variant="light"
                          color={taskStatusColors[task.status] ?? 'gray'}
                        >
                          {task.status}
                        </Badge>
                      </Group>

                      {task.description && (
                        <Text size="xs" c="dimmed" lineClamp={2}>
                          {task.description}
                        </Text>
                      )}

                      <Group justify="space-between" mt={2}>
                        <Badge
                          size="xs"
                          variant="light"
                          color={priorityColors[task.priority] ?? 'gray'}
                        >
                          {task.priority} priority
                        </Badge>
                        {task.dueDate && (
                          <Group gap={4} wrap="nowrap">
                            <IconCalendar size={13} style={{ color: 'var(--app-text-muted)' }} />
                            <Text size="xs" c="dimmed">
                              {formatDate(task.dueDate)}
                            </Text>
                          </Group>
                        )}
                      </Group>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            )}
          </Card>
        </Grid.Col>
      </Grid>

      <ProjectModal
        opened={editOpened}
        onClose={() => setEditOpened(false)}
        mode="edit"
        project={project}
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
          setTaskOpened(false);
        }}
      />

      <TaskModal
        opened={editTaskOpened}
        onClose={() => {
          setEditTaskOpened(false);
          setEditingTask(null);
        }}
        mode="edit"
        task={editingTask ?? undefined}
        projectId={projectId}
        onSuccess={() => {
          refetch();
          if (selectedEmployeeId) {
            refetchEmployeeTasks();
          }
          setEditTaskOpened(false);
          setEditingTask(null);
        }}
      />

      <TaskDetailsModal
        opened={viewOpened}
        onClose={() => {
          setViewOpened(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      <ConfirmDeleteModal
        opened={deleteOpened}
        onClose={() => {
          setDeleteOpened(false);
          setDeletingTask(null);
        }}
        loading={deleteTaskMutation.isPending}
        title="Delete Task"
        message={`Are you sure you want to delete "${deletingTask?.title ?? ''}"?`}
        onConfirm={() => {
          if (!deletingTask) return;

          deleteTaskMutation.mutate(deletingTask.id, {
            onSuccess: () => {
              setDeleteOpened(false);
              setDeletingTask(null);
              refetch();
              if (selectedEmployeeId) {
                refetchEmployeeTasks();
              }
            },
          });
        }}
      />
    </div>
  );
}
