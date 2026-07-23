import { Card, Text, Timeline, Title } from '@mantine/core';
import {
  IconArrowRight,
  IconMessageCircle,
  IconPlus,
  IconUserPlus,
} from '@tabler/icons-react';
import dayjs from 'dayjs';

import Loader from '@/styles/loader';
import { useTaskActivities } from '../hooks/useActivities';
import type { ActivityType } from '../types/activity';

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { color: string; icon: React.ComponentType<{ size?: number }> }
> = {
  TASK_CREATED: { color: 'green', icon: IconPlus },
  ASSIGNED: { color: 'blue', icon: IconUserPlus },
  STATUS_CHANGED: { color: 'violet', icon: IconArrowRight },
  COMMENT_ADDED: { color: 'gray', icon: IconMessageCircle },
};

interface ActivityTimelineProps {
  taskId: string;
}

export default function ActivityTimeline({ taskId }: ActivityTimelineProps) {
  const { data: activities = [], isLoading, isError } = useTaskActivities(taskId);

  return (
    <Card withBorder radius="md" p="md">
      <Title order={5} mb="md">
        Activity
      </Title>

      {isLoading ? (
        <Loader label="Loading activity..." size={28} />
      ) : isError ? (
        <Text size="sm" c="red">
          Activity could not be loaded.
        </Text>
      ) : activities.length === 0 ? (
        <Text size="sm" c="dimmed">
          No activity yet.
        </Text>
      ) : (
        <Timeline active={activities.length} bulletSize={24} lineWidth={2}>
          {activities.map((activity) => {
            const config = ACTIVITY_CONFIG[activity.type];
            const Icon = config.icon;

            return (
              <Timeline.Item
                key={activity.id}
                color={config.color}
                bullet={<Icon size={12} />}
                title={
                  <Text span fw={600} size="sm">
                    {activity.actor?.fullName ?? 'Someone'}
                  </Text>
                }
              >
                <Text size="sm" c="dimmed">
                  {activity.message}
                </Text>

                {activity.createdAt && (
                  <Text size="xs" c="dimmed" mt={2}>
                    {dayjs(activity.createdAt).format('DD MMM YYYY, HH:mm')}
                  </Text>
                )}
              </Timeline.Item>
            );
          })}
        </Timeline>
      )}
    </Card>
  );
}
