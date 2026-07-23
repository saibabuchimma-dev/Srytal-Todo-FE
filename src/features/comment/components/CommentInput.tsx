import { Button, Group, Stack } from '@mantine/core';
import { useState } from 'react';

import { useAddComment } from '../hooks/useComments';
import MarkdownEditor from './MarkdownEditor';

interface CommentInputProps {
  taskId: string;
}

export default function CommentInput({ taskId }: CommentInputProps) {
  const [value, setValue] = useState('');
  const addComment = useAddComment(taskId);

  const handleSubmit = () => {
    const content = value.trim();

    if (!content) {
      return;
    }

    addComment.mutate(content, {
      onSuccess: () => setValue(''),
    });
  };

  return (
    <Stack gap="xs">
      <MarkdownEditor taskId={taskId} value={value} onChange={setValue} />

      <Group justify="flex-end">
        <Button
          onClick={handleSubmit}
          loading={addComment.isPending}
          disabled={!value.trim()}
        >
          Comment
        </Button>
      </Group>
    </Stack>
  );
}
