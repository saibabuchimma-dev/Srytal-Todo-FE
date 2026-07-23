import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownContentProps {
  children: string;
}

const MARKDOWN_STYLES = `
.md-body { font-size: var(--mantine-font-size-sm); line-height: 1.55; word-break: break-word; }
.md-body > *:first-child { margin-top: 0; }
.md-body > *:last-child { margin-bottom: 0; }
.md-body p { margin: 0 0 8px; }
.md-body h1, .md-body h2, .md-body h3, .md-body h4 { margin: 12px 0 6px; font-weight: 700; line-height: 1.3; }
.md-body h1 { font-size: 1.4em; }
.md-body h2 { font-size: 1.25em; }
.md-body h3 { font-size: 1.1em; }
.md-body ul, .md-body ol { margin: 0 0 8px; padding-left: 22px; }
.md-body ul { list-style: disc; }
.md-body ol { list-style: decimal; }
.md-body li { margin-bottom: 2px; }
.md-body a { color: var(--mantine-color-blue-6); text-decoration: none; }
.md-body a:hover { text-decoration: underline; }
.md-body code { background: var(--mantine-color-gray-1); padding: 1px 5px; border-radius: 4px; font-size: 0.875em; font-family: monospace; }
.md-body pre { background: var(--mantine-color-gray-1); padding: 10px 12px; border-radius: 8px; overflow-x: auto; margin: 0 0 8px; }
.md-body pre code { background: transparent; padding: 0; }
.md-body blockquote { border-left: 3px solid var(--mantine-color-gray-4); margin: 0 0 8px; padding-left: 10px; color: var(--mantine-color-dimmed); }
.md-body img { max-width: 100%; border-radius: 8px; }
.md-body table { border-collapse: collapse; margin: 0 0 8px; }
.md-body th, .md-body td { border: 1px solid var(--mantine-color-gray-3); padding: 4px 8px; }
`;

export default function MarkdownContent({ children }: MarkdownContentProps) {
  return (
    <div className="md-body">
      <style>{MARKDOWN_STYLES}</style>

      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ node: _node, ...props }) {
            void _node;
            return <a {...props} target="_blank" rel="noopener noreferrer" />;
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
