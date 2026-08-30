import { ActionIcon, Box, Group, Tabs, Text, Textarea, Tooltip } from '@mantine/core';
import {
  IconBold,
  IconCode,
  IconHeading,
  IconItalic,
  IconLink,
  IconList,
  IconListNumbers,
  IconPaperclip,
  IconQuote,
} from '@tabler/icons-react';
import { useRef, useState } from 'react';

import { uploadTaskAttachment } from '@/features/attachment/services/attachment.service';
import { toast } from '@/shared/utils/toast';
import MarkdownContent from './MarkdownContent';

type Command = 'heading' | 'bold' | 'italic' | 'quote' | 'code' | 'link' | 'ul' | 'ol';

const TOOLBAR: { icon: React.ComponentType<{ size?: number }>; label: string; command: Command }[] =
  [
    { icon: IconHeading, label: 'Heading', command: 'heading' },
    { icon: IconBold, label: 'Bold', command: 'bold' },
    { icon: IconItalic, label: 'Italic', command: 'italic' },
    { icon: IconQuote, label: 'Quote', command: 'quote' },
    { icon: IconCode, label: 'Code', command: 'code' },
    { icon: IconLink, label: 'Link', command: 'link' },
    { icon: IconList, label: 'Bulleted list', command: 'ul' },
    { icon: IconListNumbers, label: 'Numbered list', command: 'ol' },
  ];

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  taskId: string;
  placeholder?: string;
  minRows?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  taskId,
  placeholder = 'Use Markdown to format your comment',
  minRows = 4,
}: MarkdownEditorProps) {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [tab, setTab] = useState<string | null>('write');
  const [uploading, setUploading] = useState(false);

  const restoreSelection = (selectionStart: number, selectionEnd: number) => {
    requestAnimationFrame(() => {
      const el = ref.current;
      if (!el) return;
      el.focus();
      el.selectionStart = selectionStart;
      el.selectionEnd = selectionEnd;
    });
  };

  const wrap = (before: string, after = before) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.slice(start, end);
    onChange(value.slice(0, start) + before + selected + after + value.slice(end));
    restoreSelection(start + before.length, start + before.length + selected.length);
  };

  const linePrefix = (prefix: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const head = value.slice(0, lineStart);
    const block = value.slice(lineStart, end);
    const prefixed = block
      .split('\n')
      .map((line) => `${prefix}${line}`)
      .join('\n');
    onChange(head + prefixed + value.slice(end));
    restoreSelection(lineStart, lineStart + prefixed.length);
  };

  const runCommand = (command: Command) => {
    switch (command) {
      case 'heading':
        return linePrefix('### ');
      case 'bold':
        return wrap('**');
      case 'italic':
        return wrap('_');
      case 'quote':
        return linePrefix('> ');
      case 'code':
        return wrap('`');
      case 'link':
        return wrap('[', '](url)');
      case 'ul':
        return linePrefix('- ');
      case 'ol':
        return linePrefix('1. ');
    }
  };

  const uploadFiles = async (files: File[]) => {
    const valid = files.filter(Boolean);
    if (!valid.length) return;

    setUploading(true);
    let text = value;

    try {
      for (const file of valid) {
        const uploaded = await uploadTaskAttachment(taskId, file);
        const isImage = uploaded.mimeType.startsWith('image/');
        const link = `${isImage ? '!' : ''}[${uploaded.originalName}](${uploaded.url})`;
        const separator = text.length === 0 || text.endsWith('\n') ? '' : '\n';
        text = `${text}${separator}${link}\n`;
        onChange(text);
      }
    } catch {
      toast.error('One or more files could not be uploaded.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      style={{
        border: '1px solid var(--mantine-color-gray-3)',
        borderRadius: 'var(--mantine-radius-md)',
        overflow: 'hidden',
      }}
    >
      <Tabs value={tab} onChange={setTab} variant="default">
        <Tabs.List>
          <Tabs.Tab value="write">Write</Tabs.Tab>
          <Tabs.Tab value="preview">Preview</Tabs.Tab>

          <Group gap={2} ml="auto" pr="xs" wrap="nowrap">
            {TOOLBAR.map(({ icon: Icon, label, command }) => (
              <Tooltip key={label} label={label} withArrow>
                <ActionIcon
                  variant="subtle"
                  color="gray"
                  size="sm"
                  onClick={() => runCommand(command)}
                  disabled={tab !== 'write'}
                  aria-label={label}
                >
                  <Icon size={16} />
                </ActionIcon>
              </Tooltip>
            ))}
          </Group>
        </Tabs.List>

        <Tabs.Panel value="write" p="xs">
          <Textarea
            ref={ref}
            value={value}
            onChange={(event) => onChange(event.currentTarget.value)}
            placeholder={placeholder}
            autosize
            minRows={minRows}
            maxRows={16}
            variant="unstyled"
            onPaste={(event) => {
              const files = Array.from(event.clipboardData.files);
              if (files.length) {
                event.preventDefault();
                void uploadFiles(files);
              }
            }}
            onDrop={(event) => {
              const files = Array.from(event.dataTransfer.files);
              if (files.length) {
                event.preventDefault();
                void uploadFiles(files);
              }
            }}
          />
        </Tabs.Panel>

        <Tabs.Panel value="preview" p="sm">
          {value.trim() ? (
            <MarkdownContent>{value}</MarkdownContent>
          ) : (
            <Text size="sm" c="dimmed">
              Nothing to preview.
            </Text>
          )}
        </Tabs.Panel>
      </Tabs>

      <Group
        justify="flex-start"
        px="sm"
        py={6}
        style={{ borderTop: '1px solid var(--mantine-color-gray-2)' }}
      >
        <label style={{ cursor: 'pointer' }}>
          <input
            type="file"
            multiple
            hidden
            disabled={uploading}
            onChange={(event) => {
              const files = Array.from(event.currentTarget.files ?? []);
              void uploadFiles(files);
              event.currentTarget.value = '';
            }}
          />
          <Group gap={6} c="dimmed">
            <IconPaperclip size={15} />
            <Text size="xs">
              {uploading ? 'Uploading…' : 'Paste, drop, or click to add files'}
            </Text>
          </Group>
        </label>
      </Group>
    </Box>
  );
}
