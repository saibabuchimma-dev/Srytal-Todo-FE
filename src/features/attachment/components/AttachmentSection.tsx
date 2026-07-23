import { Button, Card, FileButton, Group, Stack, Text, Title } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';

import Loader from '@/styles/loader';
import { useTaskAttachments, useUploadAttachment } from '../hooks/useAttachments';
import AttachmentItem from './AttachmentItem';

interface AttachmentSectionProps {
  taskId: string;
}

export default function AttachmentSection({ taskId }: AttachmentSectionProps) {
  const { data: attachments = [], isLoading, isError } = useTaskAttachments(taskId);
  const uploadAttachment = useUploadAttachment(taskId);

  const handleUpload = (file: File | null) => {
    if (file) {
      uploadAttachment.mutate(file);
    }
  };

  return (
    <Card withBorder radius="md" p="md">
      <Stack>
        <Group justify="space-between">
          <Title order={5}>Attachments{attachments.length ? ` (${attachments.length})` : ''}</Title>

          <FileButton onChange={handleUpload}>
            {(props) => (
              <Button
                {...props}
                size="xs"
                variant="light"
                leftSection={<IconUpload size={16} />}
                loading={uploadAttachment.isPending}
              >
                Upload file
              </Button>
            )}
          </FileButton>
        </Group>

        {isLoading ? (
          <Loader label="Loading attachments..." size={28} />
        ) : isError ? (
          <Text size="sm" c="red">
            Attachments could not be loaded.
          </Text>
        ) : attachments.length === 0 ? (
          <Text size="sm" c="dimmed">
            No attachments yet. Upload a file to share it on this task.
          </Text>
        ) : (
          <Stack gap="sm">
            {attachments.map((attachment) => (
              <AttachmentItem key={attachment.id} attachment={attachment} taskId={taskId} />
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
}
