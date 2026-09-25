import loginIllustration from '@/assets/images/img1.png';
import { Badge, Box, Group, Stack, Text, Title } from '@mantine/core';
import {
  IconChecklist,
  IconShieldCheck,
  IconChartDots,
} from '@tabler/icons-react';

export default function LoginHero() {
  return (
    <div
      className="relative flex h-full flex-col justify-between overflow-hidden rounded-[24px] p-10"
      style={{
        background:
          'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)',
        color: '#FFFFFF',
        minHeight: '100%',
      }}
    >
      <img
        src={loginIllustration}
        alt=""
        aria-hidden
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'right center',
          opacity: 0.28,
          mixBlendMode: 'luminosity',
        }}
      />

      <Box style={{ position: 'relative', zIndex: 1 }}>
        <Group gap="xs" align="center">
          <Badge
            variant="filled"
            color="indigo"
            size="md"
            radius="xl"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textTransform: 'none',
              fontWeight: 700,
            }}
          >
            SRYTAL
          </Badge>
          <Badge
            variant="outline"
            color="gray"
            size="md"
            radius="xl"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              borderColor: 'rgba(255, 255, 255, 0.2)',
              textTransform: 'none',
            }}
          >
            Workspace Cloud
          </Badge>
        </Group>
      </Box>

      <Stack
        gap="lg"
        style={{ position: 'relative', zIndex: 1, maxWidth: 520 }}
      >
        <Title
          order={1}
          fw={800}
          fz={36}
          lh={1.15}
          style={{ letterSpacing: '-0.03em' }}
        >
          Organize, execute, and deliver projects with precision.
        </Title>
        <Text
          fz="sm"
          style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: 1.6 }}
        >
          Designed for modern engineering and product teams. Experience instant
          task tracking, interactive Kanban workflows, and executive analytics.
        </Text>

        <Group gap="xs" mt="sm" wrap="wrap">
          <Badge
            size="md"
            radius="md"
            leftSection={<IconChecklist size={14} />}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textTransform: 'none',
            }}
          >
            Manage your team
          </Badge>
          <Badge
            size="md"
            radius="md"
            leftSection={<IconChecklist size={14} />}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textTransform: 'none',
            }}
          >
            Real-time Kanban
          </Badge>
          <Badge
            size="md"
            radius="md"
            leftSection={<IconShieldCheck size={14} />}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textTransform: 'none',
            }}
          >
            Role-Based Access
          </Badge>
          <Badge
            size="md"
            radius="md"
            leftSection={<IconChartDots size={14} />}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              textTransform: 'none',
            }}
          >
            Executive Analytics
          </Badge>
        </Group>
      </Stack>

      <Box style={{ position: 'relative', zIndex: 1 }}>
        <Text fz="xs" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
          Enterprise grade security • 99.9% uptime SLA
        </Text>
      </Box>
    </div>
  );
}
