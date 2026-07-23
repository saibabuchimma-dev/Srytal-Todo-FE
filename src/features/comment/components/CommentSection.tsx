import { Card, Stack, Text, Title } from '@mantine/core';
import Loader from '@/styles/loader';
import { useTaskComments } from '../hooks/useComments';
import CommentInput from './CommentInput';
import CommentItem from './CommentItem';

interface CommentSectionProps {
  taskId: string;
}

export default function CommentSection({ taskId }: CommentSectionProps) {
  const { data: comments = [], isLoading, isError } = useTaskComments(taskId);

  return (
    <Card withBorder radius="md" p="md">
      <Stack>
        <Title order={5}>Comments{comments.length ? ` (${comments.length})` : ''}</Title>

        <CommentInput taskId={taskId} />

        {isLoading ? (
          <Loader label="Loading comments..." size={28} />
        ) : isError ? (
          <Text size="sm" c="red">
            Comments could not be loaded.
          </Text>
        ) : comments.length === 0 ? (
          <Text size="sm" c="dimmed">
            No comments yet. Be the first to comment.
          </Text>
        ) : (
          <Stack gap="sm">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} taskId={taskId} />
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
