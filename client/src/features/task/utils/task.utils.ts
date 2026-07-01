import dayjs from 'dayjs';

import type { Task, TaskPriority, TaskSortOption, TaskStatus } from '../types/task';

export const getTaskStats = (tasks: Task[]) => ({
  pending: tasks.filter((task) => task.status === 'Pending').length,
  inProgress: tasks.filter((task) => task.status === 'In Progress').length,
  completed: tasks.filter((task) => task.status === 'Completed').length,
  total: tasks.length,
});

export const filterTasks = ({
  tasks,
  search,
  status,
  priority,
  sort,
}: {
  tasks: Task[];
  search: string;
  status: TaskStatus | 'All';
  priority: TaskPriority | 'All';
  sort: TaskSortOption;
}) => {
  const normalizedSearch = search.trim().toLowerCase();

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(normalizedSearch) ||
      task.description.toLowerCase().includes(normalizedSearch);
    const matchesStatus = status === 'All' || task.status === status;
    const matchesPriority = priority === 'All' || task.priority === priority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  return filteredTasks.toSorted((currentTask, nextTask) => {
    if (sort === 'Oldest') {
      return dayjs(currentTask.createdAt).valueOf() - dayjs(nextTask.createdAt).valueOf();
    }

    if (sort === 'Due Date') {
      return dayjs(currentTask.dueDate).valueOf() - dayjs(nextTask.dueDate).valueOf();
    }

    return dayjs(nextTask.createdAt).valueOf() - dayjs(currentTask.createdAt).valueOf();
  });
};

export const getPaginatedTasks = (tasks: Task[], page: number, pageSize: number) => {
  const startIndex = (page - 1) * pageSize;

  return tasks.slice(startIndex, startIndex + pageSize);
};
