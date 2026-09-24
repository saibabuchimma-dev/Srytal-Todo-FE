import { motion, AnimatePresence } from 'framer-motion';
import { Text, Badge, Group, Box } from '@mantine/core';
import {
  IconClock,
  IconActivity,
  IconChecklist,
  IconPlus,
} from '@tabler/icons-react';
import type { Task, TaskStatus } from '../types/task';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  status: TaskStatus;
  label: string;
  color: string;
  count: number;
  tasks: Task[];
  isOver: boolean;
  updatingTaskId: string | null;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
  onDragOver: (status: TaskStatus | null) => void;
  onDrop: (status: TaskStatus) => void;
}

const ICONS: Record<TaskStatus, typeof IconClock> = {
  Pending: IconClock,
  'In Progress': IconActivity,
  Completed: IconChecklist,
};

export default function KanbanColumn({
  status,
  label,
  color,
  count,
  tasks,
  isOver,
  updatingTaskId,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
}: KanbanColumnProps) {
  const Icon = ICONS[status];

  return (
    <motion.div
      layout
      animate={{
        backgroundColor: isOver ? 'var(--app-accent-soft)' : 'transparent',
      }}
      transition={{ duration: 200 }}
    >
      <div
        style={{
          backgroundColor: isOver
            ? 'var(--app-accent-soft)'
            : 'var(--app-surface-2)',
          borderRadius: 16,
          border: `2px dashed ${isOver ? 'var(--app-primary)' : 'var(--app-border)'}`,
          transition: 'all 200ms ease-out',
          minHeight: 500,
        }}
        onDragOver={(e) => {
          e.preventDefault();
          e.dataTransfer.dropEffect = 'move';
          onDragOver(status);
        }}
        onDragLeave={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            onDragOver(null);
          }
        }}
        onDrop={(e) => {
          e.preventDefault();
          onDrop(status);
        }}
      >
        <div
          style={{
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Group justify="space-between" align="center" mb="lg">
            <Group gap="sm" align="center">
              <motion.span
                animate={{ rotate: isOver ? 15 : 0, scale: isOver ? 1.1 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <Icon
                  size={20}
                  stroke={2}
                  style={{ color: `var(--mantine-color-${color}-6)` }}
                />
              </motion.span>
              <Text fw={700} size="lg" c="var(--app-text)">
                {label}
              </Text>
            </Group>
            <Badge
              variant="light"
              color={color}
              size="sm"
              style={{
                backgroundColor: `var(--mantine-color-${color}-6)`,
                color: 'white',
              }}
            >
              {count}
            </Badge>
          </Group>

          <AnimatePresence mode="popLayout">
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                transition={{ duration: 0.2, delay: index * 0.04 }}
              >
                <KanbanCard
                  task={task}
                  isUpdating={updatingTaskId === task.id}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                />
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                textAlign: 'center',
              }}
            >
              <div
                className="rounded-full p-3"
                style={{
                  background: 'var(--app-accent-soft)',
                  color: 'var(--app-accent-fg)',
                }}
              >
                <IconPlus size={24} />
              </div>
              <Text size="sm" c="dimmed" mt="md" ta="center">
                No {label.toLowerCase()} tasks
              </Text>
            </motion.div>
          )}

          <div
            style={{
              marginTop: 'auto',
              paddingTop: '16px',
              borderTop: '1px solid var(--app-border)',
            }}
          >
            <Box
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '12px',
                borderRadius: 12,
                backgroundColor: 'var(--app-surface)',
                border: '1px dashed var(--app-border)',
                color: 'var(--app-text-muted)',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor =
                  'var(--app-surface-hover)';
                e.currentTarget.style.borderColor = 'var(--app-primary)';
                e.currentTarget.style.color = 'var(--app-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--app-surface)';
                e.currentTarget.style.borderColor = 'var(--app-border)';
                e.currentTarget.style.color = 'var(--app-text-muted)';
              }}
            >
              + Add task
            </Box>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
