import styled from 'styled-components';

interface LoaderProps {
  label?: string;
  size?: number;
  fullScreen?: boolean;
}

const Loader = ({ label = 'Loading', size = 40, fullScreen = false }: LoaderProps) => {
  return (
    <StyledWrapper $fullScreen={fullScreen} $size={size} role="status" aria-live="polite">
      <div className="loader" aria-hidden="true" />
      <span>{label}</span>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $fullScreen: boolean; $size: number }>`
  display: flex;
  min-height: ${({ $fullScreen }) => ($fullScreen ? '100vh' : '100%')};
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: var(--app-text-muted);
  font-size: 0.875rem;
  font-weight: 600;

  .loader {
    position: relative;
    width: ${({ $size }) => `${$size}px`};
    height: ${({ $size }) => `${$size}px`};
    flex: 0 0 auto;
    transform: rotate(165deg);
  }

  .loader:before,
  .loader:after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    display: block;
    width: ${({ $size }) => `${$size / 5}px`};
    height: ${({ $size }) => `${$size / 5}px`};
    border-radius: ${({ $size }) => `${$size / 10}px`};
    transform: translate(-50%, -50%);
  }

  .loader:before {
    animation: before8 2s infinite;
  }

  .loader:after {
    animation: after6 2s infinite;
  }

  @keyframes before8 {
    0% {
      width: ${({ $size }) => `${$size / 5}px`};
      box-shadow:
        ${({ $size }) => `${$size / 2.5}px ${-$size / 5}px`} var(--app-loader-a),
        ${({ $size }) => `${-$size / 2.5}px ${$size / 5}px`} var(--app-loader-b);
    }

    35% {
      width: ${({ $size }) => `${$size}px`};
      box-shadow:
        ${({ $size }) => `0 ${-$size / 5}px`} var(--app-loader-a),
        ${({ $size }) => `0 ${$size / 5}px`} var(--app-loader-b);
    }

    70% {
      width: ${({ $size }) => `${$size / 5}px`};
      box-shadow:
        ${({ $size }) => `${-$size / 2.5}px ${-$size / 5}px`} var(--app-loader-a),
        ${({ $size }) => `${$size / 2.5}px ${$size / 5}px`} var(--app-loader-b);
    }

    100% {
      box-shadow:
        ${({ $size }) => `${$size / 2.5}px ${-$size / 5}px`} var(--app-loader-a),
        ${({ $size }) => `${-$size / 2.5}px ${$size / 5}px`} var(--app-loader-b);
    }
  }

  @keyframes after6 {
    0% {
      height: ${({ $size }) => `${$size / 5}px`};
      box-shadow:
        ${({ $size }) => `${$size / 5}px ${$size / 2.5}px`} var(--app-loader-c),
        ${({ $size }) => `${-$size / 5}px ${-$size / 2.5}px`} var(--app-loader-d);
    }

    35% {
      height: ${({ $size }) => `${$size}px`};
      box-shadow:
        ${({ $size }) => `${$size / 5}px 0`} var(--app-loader-c),
        ${({ $size }) => `${-$size / 5}px 0`} var(--app-loader-d);
    }

    70% {
      height: ${({ $size }) => `${$size / 5}px`};
      box-shadow:
        ${({ $size }) => `${$size / 5}px ${-$size / 2.5}px`} var(--app-loader-c),
        ${({ $size }) => `${-$size / 5}px ${$size / 2.5}px`} var(--app-loader-d);
    }

    100% {
      box-shadow:
        ${({ $size }) => `${$size / 5}px ${$size / 2.5}px`} var(--app-loader-c),
        ${({ $size }) => `${-$size / 5}px ${-$size / 2.5}px`} var(--app-loader-d);
    }
  }
`;

export default Loader;
