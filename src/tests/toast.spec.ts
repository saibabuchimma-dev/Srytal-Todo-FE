import { toast } from '@/shared/utils/toast';
import { toast as sonner } from 'sonner';

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

const mocked = sonner as unknown as {
  success: jest.Mock;
  error: jest.Mock;
  warning: jest.Mock;
  info: jest.Mock;
};

describe('toast wrapper', () => {
  it('delegates each variant to sonner with the description', () => {
    toast.success('Saved', 'All good');
    expect(mocked.success).toHaveBeenCalledWith('Saved', { description: 'All good' });

    toast.error('Failed', 'Nope');
    expect(mocked.error).toHaveBeenCalledWith('Failed', { description: 'Nope' });

    toast.warning('Careful');
    expect(mocked.warning).toHaveBeenCalledWith('Careful', { description: undefined });

    toast.info('FYI', 'note');
    expect(mocked.info).toHaveBeenCalledWith('FYI', { description: 'note' });
  });
});
