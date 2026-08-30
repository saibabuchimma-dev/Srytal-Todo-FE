// Jest stub for react-markdown (pure ESM — awkward under Jest). Renders children
// text verbatim, which is enough for assertions in unit tests.
import React from 'react';

export default function ReactMarkdown({ children }: { children?: React.ReactNode }) {
  return React.createElement('div', { 'data-testid': 'markdown' }, children);
}
