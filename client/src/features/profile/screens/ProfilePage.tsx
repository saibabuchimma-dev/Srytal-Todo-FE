import { Avatar, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconMail, IconMapPin, IconPhone, IconUserShield } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import Loader from '@/styles/loader';
import { useProfile } from '../hooks/useProfile';

const profileItems = [
  { key: 'email', label: 'Email', icon: IconMail },
  { key: 'phone', label: 'Phone', icon: IconPhone },
  { key: 'location', label: 'Location', icon: IconMapPin },
  { key: 'role', label: 'Role', icon: IconUserShield },
] as const;

export default function ProfilePage() {
  const { data: profile, isLoading } = useProfile();

  if (isLoading) {
    return <Loader label="Loading profile" size={44} />;
  }

  if (!profile) {
    return null;
  }

  return (
    <Stack className="mx-auto max-w-5xl" gap="lg">
      <Card withBorder radius="md" shadow="sm" p="xl">
        <Group align="center">
          <Avatar src={profile.avatar} size={88} radius="xl" />
          <Stack gap={4}>
            <Title order={2}>{profile.name}</Title>
            <Text c="dimmed">{profile.designation}</Text>
          </Stack>
        </Group>
      </Card>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        {profileItems.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div key={item.key} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
              <Card withBorder radius="md" shadow="sm">
                <Group>
                  <Avatar color="indigo" variant="light" radius="md">
                    <Icon size={20} />
                  </Avatar>
                  <Stack gap={0}>
                    <Text size="sm" c="dimmed">
                      {item.label}
                    </Text>
                    <Text fw={700}>{profile[item.key]}</Text>
                  </Stack>
                </Group>
              </Card>
            </motion.div>
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
