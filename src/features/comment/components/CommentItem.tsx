import { ActionIcon, Avatar, Button, Card, Group, Menu, Stack, Text } from '@mantine/core';
import { IconDotsVertical, IconEdit, IconTrash } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useState } from 'react';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { useDeleteComment, useUpdateComment } from '../hooks/useComments';
import type { TaskComment } from '../types/comment';
import MarkdownContent from './MarkdownContent';
import MarkdownEditor from './MarkdownEditor';

interface CommentItemProps {
  comment: TaskComment;
  taskId: string;
}

export default function CommentItem({ comment, taskId }: CommentItemProps) {
  const user = useAuthStore((state) => state.user);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(comment.content);

  const updateComment = useUpdateComment(taskId);
  const deleteComment = useDeleteComment(taskId);

  const isAuthor = !!user?.id && user.id === comment.author?.id;
  const isAdmin = user?.role === 'Admin';
  const canDelete = isAuthor || isAdmin;

  const handleSave = () => {
    const content = draft.trim();

    if (!content || content === comment.content) {
      setEditing(false);
      return;
    }

    updateComment.mutate(
      { id: comment.id, content },
      { onSuccess: () => setEditing(false) },
    );
  };

  return (
    <Card withBorder radius="md" p="sm">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Group gap="xs" align="flex-start" wrap="nowrap" style={{ flex: 1 }}>
          <Avatar size="sm" radius="xl" src={comment.author?.avatar || undefined}>
            {comment.author?.fullName?.charAt(0)?.toUpperCase() ?? '?'}
          </Avatar>

          <Stack gap={4} style={{ flex: 1 }}>
            <Group gap={6}>
              <Text fw={600} size="sm">
                {comment.author?.fullName ?? 'Unknown'}
              </Text>

              <Text size="xs" c="dimmed">
                {comment.createdAt ? dayjs(comment.createdAt).format('DD MMM YYYY, HH:mm') : ''}
              </Text>
            </Group>

            {editing ? (
              <Stack gap="xs">
                <MarkdownEditor
                  taskId={taskId}
                  value={draft}
                  onChange={setDraft}
                  minRows={3}
                />

                <Group gap="xs">
                  <Button size="xs" onClick={handleSave} loading={updateComment.isPending}>
                    Save
                  </Button>

                  <Button
                    size="xs"
                    variant="subtle"
                    color="gray"
                    onClick={() => {
                      setDraft(comment.content);
                      setEditing(false);
                    }}
                  >
                    Cancel
                  </Button>
                </Group>
              </Stack>
            ) : (
              <MarkdownContent>{comment.content}</MarkdownContent>
            )}
          </Stack>
        </Group>

        {!editing && canDelete && (
          <Menu shadow="md" width={160} position="bottom-end">
            <Menu.Target>
              <ActionIcon variant="subtle" color="gray">
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              {isAuthor && (
                <Menu.Item leftSection={<IconEdit size={14} />} onClick={() => setEditing(true)}>
                  Edit
                </Menu.Item>
              )}

              <Menu.Item
                color="red"
                leftSection={<IconTrash size={14} />}
                onClick={() => deleteComment.mutate(comment.id)}
              >
                Delete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </Card>
  );
}
