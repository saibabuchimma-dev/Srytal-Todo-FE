import { Box } from '@mantine/core';

import ThemeToggle from '@/shared/ui/ThemeToggle/ThemeToggle';
import LoginForm from '../components/LoginForm';
import LoginHero from '../components/LoginHero';

interface LoginScreenProps {
  portal?: 'admin' | 'employee';
}

export default function LoginScreen({ portal = 'employee' }: LoginScreenProps) {
  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        background: 'var(--app-bg)',
        color: 'var(--app-text)',
      }}
    >
      {/* Light / dark toggle — mirrors the dashboard, pinned to the top-right. */}
      <Box style={{ position: 'absolute', top: 16, right: 16, zIndex: 10 }}>
        <ThemeToggle chip />
      </Box>

      {/* Brand panel — hidden on small screens */}
      <Box visibleFrom="md" style={{ flexBasis: '65%', maxWidth: '65%', padding: 16 }}>
        <LoginHero />
      </Box>

      {/* Form panel */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
        }}
      >
        <Box w="100%" maw={420}>
          <LoginForm portal={portal} />
        </Box>
      </Box>
    </Box>
  );
}
