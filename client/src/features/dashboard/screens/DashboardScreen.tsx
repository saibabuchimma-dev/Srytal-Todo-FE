import { useState } from 'react';

import DashboardStats from '../components/DashboardStats';

import TaskList from '@/features/task/components/TaskList';
import AddTaskButton from '@/features/task/components/AddTaskButton';
import AddTaskDrawer from '@/features/task/components/AddTaskDrawer';
import EmployeeHeader from '@/features/employee/components/EmployeeHeader';

export default function DashboardScreen() {
  const [opened, setOpened] = useState(false);

  return (
    <>
      <EmployeeHeader />

      <DashboardStats />

      <div className="mb-5 flex justify-end">
        <AddTaskButton onClick={() => setOpened(true)} />
      </div>

      <TaskList />

      <AddTaskDrawer opened={opened} onClose={() => setOpened(false)} />
    </>
  );
}
