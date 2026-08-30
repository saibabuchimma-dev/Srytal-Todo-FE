import type { FormEventHandler, ReactNode } from 'react';

import AppModal from '@/shared/ui/Modal/AppModal';

interface FormModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  loading?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  size?: string | number;
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export default function FormModal({
  opened,
  onClose,
  title,
  subtitle,
  icon,
  children,
  loading = false,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  size = 'md',
  onSubmit,
}: FormModalProps) {
  return (
    <AppModal
      opened={opened}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      size={size}
      loading={loading}
      submitLabel={submitLabel}
      cancelLabel={cancelLabel}
      onSubmit={onSubmit}
    >
      {children}
    </AppModal>
  );
}
