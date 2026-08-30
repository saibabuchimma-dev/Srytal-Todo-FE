import * as lazyScreens from '@/app/router/lazyScreens';

describe('lazyScreens', () => {
  it('exports lazy components for every route screen', () => {
    const names = [
      'LoginScreen',
      'ChangePasswordScreen',
      'DashboardScreen',
      'EmployeesPage',
      'EmployeeDetailsPage',
      'TasksPage',
      'TaskDetailsPage',
      'ProjectsPage',
      'ProjectDetailsPage',
      'ProfilePage',
      'SettingsPage',
      'MyTasksPage',
      'MyProjectsPage',
      'TaskBoardPage',
      'ReportsPage',
    ] as const;

    for (const name of names) {
      const Comp = (lazyScreens as Record<string, unknown>)[name];
      expect(Comp).toBeDefined();
      // React.lazy returns an object with a $$typeof marker.
      expect(typeof Comp).toBe('object');
    }
  });
});
