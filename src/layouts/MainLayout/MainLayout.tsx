import { AppShell } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <AppShell header={{ height: 70 }} navbar={{ width: 300, breakpoint: 'md' }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Navbar>
        <Sidebar />
      </AppShell.Navbar>

      <AppShell.Main className="bg-slate-100">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
