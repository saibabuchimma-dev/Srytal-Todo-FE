import { ActionIcon, Anchor, Card, Group, Menu, Stack, Text } from '@mantine/core';
import { IconDotsVertical, IconDownload, IconFile, IconTrash } from '@tabler/icons-react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useDeleteAttachment } from '../hooks/useAttachments';
import type { Attachment } from '../types/attachment';

interface AttachmentItemProps {
  attachment: Attachment;
  taskId: string;
}

const formatSize = (bytes: number): string => {
  if (!bytes) {
    return '0 B';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, exponent);

  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

export default function AttachmentItem({ attachment, taskId }: AttachmentItemProps) {
  const user = useAuthStore((state) => state.user);
  const deleteAttachment = useDeleteAttachment(taskId);

  const isUploader = !!user?.id && user.id === attachment.uploadedBy?.id;
  const isAdmin = user?.role === 'Admin';
  const canDelete = isUploader || isAdmin;

  return (
    <Card withBorder radius="md" p="sm">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap" style={{ minWidth: 0 }}>
          <IconFile size={22} color="var(--app-accent)" />

          <Stack gap={0} style={{ minWidth: 0 }}>
            <Anchor
              href={attachment.url}
              target="_blank"
              rel="noopener noreferrer"
              fw={600}
              size="sm"
              lineClamp={1}
            >
              {attachment.originalName}
            </Anchor>

            <Text size="xs" c="dimmed">
              {formatSize(attachment.size)}
              {attachment.uploadedBy?.fullName ? ` · ${attachment.uploadedBy.fullName}` : ''}
            </Text>
          </Stack>
        </Group>

        <Group gap={4} wrap="nowrap">
          <ActionIcon
            variant="subtle"
            color="gray"
            component="a"
            href={attachment.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download attachment"
          >
            <IconDownload size={18} />
          </ActionIcon>

          {canDelete && (
            <Menu shadow="md" width={150} position="bottom-end">
              <Menu.Target>
                <ActionIcon variant="subtle" color="gray" aria-label="Attachment actions">
                  <IconDotsVertical size={18} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={() => deleteAttachment.mutate(attachment.id)}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    </Card>
  );
}
