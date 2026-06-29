import { MantineProvider } from './providers/MantineProvider';
import { NotificationProvider } from './providers/NotificationsProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { AppRouter } from './router';

function App() {
  return (
    <MantineProvider>
      <ThemeProvider>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
      </ThemeProvider>
    </MantineProvider>
  );
}

export default App;
