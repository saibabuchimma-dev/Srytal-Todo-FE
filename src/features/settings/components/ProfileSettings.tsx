import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Divider,
  Group,
  Image,
  Modal,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconCamera } from '@tabler/icons-react';
import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';

import CenteredState from '@/shared/ui/CenteredState/CenteredState';
import { formatDate, formatDateTime } from '@/shared/utils/date';
import { toast } from '@/shared/utils/toast';
import { useProfile, useUpdateProfile } from '@/features/profile/hooks/useProfile';

const MAX_SOURCE_BYTES = 5 * 1024 * 1024;

function fileToResizedDataUrl(file: File, size = 400): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the file.'));
    reader.onload = () => {
      const img = document.createElement('img');
      img.onerror = () => reject(new Error('That file is not a valid image.'));
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Image processing is not supported in this browser.'));
          return;
        }
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export default function ProfileSettings() {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [syncedId, setSyncedId] = useState<string | null>(null);

  if (profile && profile.id !== syncedId) {
    setSyncedId(profile.id);
    setName(profile.name);
    setAvatar(profile.avatar);
  }

  if (isLoading || !profile) {
    return <CenteredState variant="loading" label="Loading profile..." minHeight={280} size={32} />;
  }

  const dirty = name.trim() !== profile.name || avatar !== profile.avatar;

  const openPicker = () => fileInputRef.current?.click();

  const handleFileSelected = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Invalid file', 'Please choose an image file.');
      return;
    }
    if (file.size > MAX_SOURCE_BYTES) {
      toast.error('Image too large', 'Please choose an image under 5 MB.');
      return;
    }

    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setAvatar(dataUrl);
    } catch (error) {
      toast.error('Upload failed', error instanceof Error ? error.message : 'Could not read image.');
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    updateProfile.mutate({ fullName: name.trim(), avatar });
  };

  return (
    <Stack gap="lg">
      <Card withBorder radius="md" p="lg">
        <Stack>
          <Group>
            <div
              style={{ position: 'relative', cursor: 'pointer' }}
              onClick={() => (avatar ? setPreviewOpen(true) : openPicker())}
              title={avatar ? 'View photo' : 'Upload photo'}
            >
              <Avatar src={avatar || undefined} size={84} radius="xl">
                {profile.name.charAt(0)?.toUpperCase()}
              </Avatar>
              <ActionIcon
                variant="filled"
                radius="xl"
                size="sm"
                aria-label="Change photo"
                style={{ position: 'absolute', right: -2, bottom: -2 }}
                onClick={(event) => {
                  event.stopPropagation();
                  openPicker();
                }}
              >
                <IconCamera size={14} />
              </ActionIcon>
            </div>

            <Stack gap={4}>
              <Group gap="xs">
                <Title order={3}>{profile.name}</Title>
                <Badge color={profile.role === 'Admin' ? 'indigo' : 'teal'}>{profile.role}</Badge>
              </Group>
              <Text c="dimmed" size="sm">
                {profile.email}
              </Text>
              <Group gap="xs" mt={2}>
                <Button variant="light" size="xs" onClick={openPicker}>
                  Change photo
                </Button>
                {avatar && (
                  <Button variant="subtle" color="red" size="xs" onClick={() => setAvatar('')}>
                    Remove
                  </Button>
                )}
              </Group>
            </Stack>
          </Group>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelected}
          />

          <Divider />

          <TextInput
            label="Full Name"
            value={name}
            onChange={(event) => setName(event.currentTarget.value)}
          />

          <TextInput
            label="Email"
            value={profile.email}
            disabled
            description="Contact an admin to change your email."
          />

          <Group justify="flex-end">
            <Button
              onClick={handleSave}
              loading={updateProfile.isPending}
              disabled={!dirty || !name.trim()}
            >
              Save changes
            </Button>
          </Group>
        </Stack>
      </Card>

      <Card withBorder radius="md" p="lg">
        <Stack gap="sm">
          <Title order={5}>Account</Title>

          <Group justify="space-between">
            <Text c="dimmed">Status</Text>
            <Badge color={profile.isActive ? 'green' : 'red'} variant="light">
              {profile.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </Group>

          <Group justify="space-between">
            <Text c="dimmed">Last login</Text>
            <Text>{profile.lastLogin ? formatDateTime(profile.lastLogin) : '—'}</Text>
          </Group>

          <Group justify="space-between">
            <Text c="dimmed">Member since</Text>
            <Text>{profile.createdAt ? formatDate(profile.createdAt) : '—'}</Text>
          </Group>
        </Stack>
      </Card>

      <Modal
        opened={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Profile photo"
        centered
        radius="lg"
        size="auto"
      >
        <Stack align="center" gap="md">
          <Image
            src={avatar || undefined}
            alt="Profile photo"
            radius="md"
            w={340}
            h={340}
            fit="cover"
          />
          <Button
            variant="light"
            onClick={() => {
              setPreviewOpen(false);
              openPicker();
            }}
          >
            Change photo
          </Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
