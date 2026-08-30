import { Button, CloseButton, LoadingOverlay, Modal, Text } from '@mantine/core';
import type { CSSProperties, FormEventHandler, ReactNode } from 'react';

export interface AppModalProps {
  opened: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  size?: string | number;
  children: ReactNode;

  onSubmit?: FormEventHandler<HTMLFormElement>;
  submitLabel?: string;
  cancelLabel?: string;
  submitColor?: string;
  loading?: boolean;
  hideFooter?: boolean;
}

const headerStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 14,
  padding: '20px 24px',
  borderBottom: '1px solid var(--app-border)',
  background: 'var(--app-surface-2)',
};

const iconBadgeStyle: CSSProperties = {
  flex: '0 0 auto',
  width: 44,
  height: 44,
  borderRadius: 12,
  display: 'grid',
  placeItems: 'center',
  color: 'var(--app-brand-on)',
  background: 'var(--app-brand-gradient)',
  boxShadow: '0 6px 16px -6px var(--app-shadow)',
};

const bodyStyle: CSSProperties = {
  position: 'relative',
  padding: '22px 24px',
  maxHeight: '62vh',
  overflowY: 'auto',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 10,
  padding: '16px 24px',
  borderTop: '1px solid var(--app-border)',
  background: 'var(--app-surface-2)',
};

export default function AppModal({
  opened,
  onClose,
  title,
  subtitle,
  icon,
  size = 'md',
  children,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  submitColor,
  loading = false,
  hideFooter = false,
}: AppModalProps) {
  const content = (
    <>
      <div style={{ height: 4, background: 'var(--app-brand-gradient)' }} />

      <header style={headerStyle}>
        {icon && <div style={iconBadgeStyle}>{icon}</div>}

        <div style={{ flex: 1, minWidth: 0 }}>
          <Text fw={700} fz="lg" lh={1.25} c="var(--app-text)">
            {title}
          </Text>
          {subtitle && (
            <Text fz="sm" lh={1.35} c="var(--app-text-muted)" mt={2}>
              {subtitle}
            </Text>
          )}
        </div>

        <CloseButton
          onClick={onClose}
          disabled={loading}
          size="lg"
          radius="md"
          aria-label="Close"
        />
      </header>

      <div style={bodyStyle}>
        <LoadingOverlay
          visible={loading}
          zIndex={5}
          overlayProps={{ blur: 1, backgroundOpacity: 0.35 }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{children}</div>
      </div>

      {!hideFooter && (
        <footer style={footerStyle}>
          <Button variant="default" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          {onSubmit && (
            <Button
              type="submit"
              color={submitColor}
              loading={loading}
              styles={
                submitColor
                  ? undefined
                  : {
                      root: {
                        border: 'none',
                        background: 'var(--app-brand-gradient)',
                        color: 'var(--app-brand-on)',
                      },
                    }
              }
            >
              {submitLabel}
            </Button>
          )}
        </footer>
      )}
    </>
  );

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      centered
      size={size}
      radius="lg"
      padding={0}
      withCloseButton={false}
      overlayProps={{ backgroundOpacity: 0.55, blur: 3 }}
      transitionProps={{ transition: 'pop', duration: 180 }}
      styles={{
        content: {
          overflow: 'hidden',
          boxShadow: '0 24px 60px -20px var(--app-shadow)',
        },
        body: { padding: 0 },
      }}
    >
      {onSubmit ? <form onSubmit={onSubmit}>{content}</form> : content}
    </Modal>
  );
}
