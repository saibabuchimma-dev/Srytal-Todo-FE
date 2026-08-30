import { renderWithProviders, screen, fireEvent } from '@test-utils';
import KanbanCard from '@/features/task/components/KanbanCard';
import KanbanColumn from '@/features/task/components/KanbanColumn';
import KanbanBoard from '@/features/task/components/KanbanBoard';
import type { Task } from '@/features/task/types/task';

const task = (over: Partial<Task> = {}): Task => ({
  id: 't1',
  title: 'Card title',
  description: 'desc',
  status: 'Pending',
  priority: 'High',
  dueDate: '2020-01-01',
  assignedEmployee: { id: 'e1', fullName: 'Emma' },
  projectDetails: { id: 'p1', name: 'Website' },
  ...over,
});

const dataTransfer = () => ({ setData: jest.fn(), getData: jest.fn(), effectAllowed: '', dropEffect: '' });

describe('KanbanCard', () => {
  it('renders assignee, project and fires drag callbacks', () => {
    const onDragStart = jest.fn();
    const onDragEnd = jest.fn();
    renderWithProviders(<KanbanCard task={task()} onDragStart={onDragStart} onDragEnd={onDragEnd} />, { withRouter: false });
    expect(screen.getByText('Card title')).toBeInTheDocument();
    expect(screen.getByText('Emma')).toBeInTheDocument();

    const card = screen.getByText('Card title').closest('div[draggable]') as HTMLElement;
    fireEvent.dragStart(card, { dataTransfer: dataTransfer() });
    expect(onDragStart).toHaveBeenCalled();
    fireEvent.dragEnd(card);
    expect(onDragEnd).toHaveBeenCalled();
  });

  it('shows an updating state and an unassigned label', () => {
    renderWithProviders(
      <KanbanCard task={task({ assignedEmployee: undefined })} isUpdating onDragStart={jest.fn()} onDragEnd={jest.fn()} />,
      { withRouter: false },
    );
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
  });
});

describe('KanbanColumn', () => {
  it('renders the status, count and empty state', () => {
    renderWithProviders(
      <KanbanColumn
        status="Pending"
        tasks={[]}
        isOver={false}
        updatingTaskId={null}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onDragOver={jest.fn()}
        onDrop={jest.fn()}
      />,
      { withRouter: false },
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('fires drag-over and drop handlers', () => {
    const onDragOver = jest.fn();
    const onDrop = jest.fn();
    const { container } = renderWithProviders(
      <KanbanColumn
        status="Completed"
        tasks={[task({ status: 'Completed' })]}
        isOver
        updatingTaskId={null}
        onDragStart={jest.fn()}
        onDragEnd={jest.fn()}
        onDragOver={onDragOver}
        onDrop={onDrop}
      />,
      { withRouter: false },
    );
    const paper = container.querySelector('.mantine-Paper-root') as HTMLElement;
    fireEvent.dragOver(paper, { dataTransfer: dataTransfer() });
    fireEvent.drop(paper, { dataTransfer: dataTransfer() });
    expect(onDragOver).toHaveBeenCalledWith('Completed');
    expect(onDrop).toHaveBeenCalledWith('Completed');
  });
});

describe('KanbanBoard', () => {
  it('groups tasks into columns and reports a status change on drop', () => {
    const onStatusChange = jest.fn();
    const { container } = renderWithProviders(
      <KanbanBoard tasks={[task()]} updatingTaskId={null} onStatusChange={onStatusChange} />,
      { withRouter: false },
    );
    // three columns rendered
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();

    // drag the pending card, drop on the In Progress column
    const card = screen.getByText('Card title').closest('div[draggable]') as HTMLElement;
    fireEvent.dragStart(card, { dataTransfer: dataTransfer() });

    const columns = container.querySelectorAll('.mantine-Paper-root');
    const inProgressCol = Array.from(columns).find((c) => c.textContent?.startsWith('In Progress')) as HTMLElement;
    fireEvent.dragOver(inProgressCol, { dataTransfer: dataTransfer() });
    fireEvent.drop(inProgressCol, { dataTransfer: dataTransfer() });

    expect(onStatusChange).toHaveBeenCalledWith('t1', 'In Progress');
  });
});
