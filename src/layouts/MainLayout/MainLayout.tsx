import { Suspense } from 'react';
import { AppShell } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import CenteredState from '@/shared/ui/CenteredState/CenteredState';

export default function MainLayout() {
  // Controls the slide-over navbar on mobile. On desktop (≥ md) the navbar is
  // always visible; below md it is collapsed until the burger toggles it.
  const [mobileOpened, { toggle: toggleMobile, close: closeMobile }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !mobileOpened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Header navOpened={mobileOpened} onNavToggle={toggleMobile} />
      </AppShell.Header>

      <AppShell.Navbar>
        {/* Close the slide-over after navigating on mobile. */}
        <Sidebar onNavigate={closeMobile} />
      </AppShell.Navbar>

      <AppShell.Main style={{ backgroundColor: 'var(--app-bg)' }}>
        {/* One Suspense boundary for all lazily-loaded child screens. */}
        <Suspense fallback={<CenteredState variant="loading" />}>
          <Outlet />
        </Suspense>
      </AppShell.Main>
    </AppShell>
  );
}
