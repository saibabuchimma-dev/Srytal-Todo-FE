import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'node:util';

// jsdom lacks these Web APIs that react-router v7 (and others) expect.
const g = globalThis as unknown as Record<string, unknown>;
if (!g.TextEncoder) g.TextEncoder = TextEncoder;
if (!g.TextDecoder) g.TextDecoder = TextDecoder;

/**
 * Value that the import-meta babel plugin rewrites `import.meta` to. Provides the
 * Vite env vars the app reads (VITE_*).
 */
(globalThis as unknown as { __viteMeta__: unknown }).__viteMeta__ = {
  url: 'file:///test',
  env: {
    VITE_APP_NAME: 'Srytal',
    VITE_API_BASE_URL: 'http://localhost:5000/api',
    VITE_APP_VERSION: '1.0.0-test',
    MODE: 'test',
    DEV: false,
    PROD: false,
  },
};

// ---- jsdom polyfills Mantine / dnd need ----
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }),
});

class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
(globalThis as unknown as { ResizeObserver: unknown }).ResizeObserver = ResizeObserverStub;

class IntersectionObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}
(globalThis as unknown as { IntersectionObserver: unknown }).IntersectionObserver =
  IntersectionObserverStub;

window.HTMLElement.prototype.scrollIntoView = jest.fn();
window.HTMLElement.prototype.hasPointerCapture = jest.fn(() => false);
window.HTMLElement.prototype.releasePointerCapture = jest.fn();
window.HTMLElement.prototype.setPointerCapture = jest.fn();

// Silence noisy but harmless act()/scroll warnings that pollute test output.
const origError = console.error;
jest.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
  const msg = String(args[0] ?? '');
  if (msg.includes('not wrapped in act') || msg.includes('scrollIntoView')) return;
  origError(...(args as []));
});
