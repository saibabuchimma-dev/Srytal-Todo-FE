import React from 'react';

export default function ReactMarkdown({ children }: { children?: React.ReactNode }) {
  return React.createElement('div', { 'data-testid': 'markdown' }, children);
}
