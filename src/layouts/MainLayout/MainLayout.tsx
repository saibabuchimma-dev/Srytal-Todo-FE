import { Suspense } from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import Header from './Header';
import Sidebar from './Sidebar';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';

export default function MainLayout() {
  const location = useLocation();
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] =
    useDisclosure(false);

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 280,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened },
      }}
      padding={0}
    >
      <AppShell.Header style={{ border: 'none', background: 'transparent' }}>
        <Header navOpened={mobileOpened} onNavToggle={toggleMobile} />
      </AppShell.Header>

      <AppShell.Navbar style={{ border: 'none', background: 'transparent' }}>
        <Sidebar onNavigate={closeMobile} />
      </AppShell.Navbar>

      <AppShell.Main
        style={{
          backgroundColor: 'var(--app-bg)',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <AnimatePresence mode="wait">
          <Suspense
            key={location.pathname}
            fallback={
              <CenteredState
                variant="loading"
                label="Loading..."
                size={40}
                minHeight="60vh"
              />
            }
          >
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              style={{ padding: 'clamp(0.75rem, 2.5vw, 1.5rem)' }}
            >
              <Outlet />
            </motion.div>
          </Suspense>
        </AnimatePresence>
      </AppShell.Main>
    </AppShell>
  );
}
