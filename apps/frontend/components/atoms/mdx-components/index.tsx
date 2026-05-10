import type { MDXComponents } from 'mdx/types';
import React from 'react';

import { CodeBlock } from './code-block';
import { FlowViewer } from './flow-viewer';
import { MermaidViewer } from './mermaid-viewer';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    CodeBlock: CodeBlock,
    FlowViewer,
    h1: ({ children }) => (
      <h1 className="mt-8 mb-4 text-4xl font-extrabold tracking-tight text-content/90 lg:text-5xl border-b border-primary/10 pb-4 break-words">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-12 mb-4 pb-2 border-b border-primary/20 text-3xl font-bold tracking-tight text-content/85 break-words">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 mb-4 text-2xl font-semibold tracking-tight text-content/80 break-words">
        {children}
      </h3>
    ),
    p: ({ children }) => (
      <p className="leading-7 [&:not(:first-child)]:mt-6 text-content/75 break-words">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="my-6 ml-6 list-disc [&>li]:mt-2 text-content/75 font-medium">{children}</ul>
    ),
    li: ({ children }) => <li className="pl-1 py-1 break-words">{children}</li>,
    blockquote: ({ children }) => (
      <blockquote className="mt-8 mb-8 border-l-4 border-primary/60 pl-8 italic text-content/70 bg-primary/5 py-6 pr-8 rounded-r-2xl shadow-sm break-words">
        {children}
      </blockquote>
    ),
    code: ({ children, className }) => {
      // Inlined code (no language class)
      if (!className) {
        return (
          <code className="relative rounded bg-primary/10 px-[0.4rem] py-[0.15rem] font-mono text-[13px] font-bold text-primary dark:text-primary-foreground/90">
            {children}
          </code>
        );
      }

      const isMermaid = className === 'language-mermaid';
      if (isMermaid) {
        return <MermaidViewer />;
      }

      // Block code handled by pre
      return <code className={className}>{children}</code>;
    },
    pre: ({ children }: React.ComponentPropsWithoutRef<'pre'>) => {
      // Robust text extraction helper
      const getCodeString = (node: React.ReactNode): string => {
        if (typeof node === 'string') return node;
        if (React.isValidElement(node)) {
          const props = node.props as { children?: React.ReactNode };
          return getCodeString(props.children);
        }
        if (Array.isArray(node)) return node.map(getCodeString).join('');
        return '';
      };

      // Find the code element: checks both primitive 'code' and custom components with language classes
      const findCodeElement = (node: React.ReactNode): React.ReactElement | null => {
        if (React.isValidElement(node)) {
          const props = node.props as { className?: string; children?: React.ReactNode };
          if (node.type === 'code' || props.className?.startsWith('language-')) {
            return node as React.ReactElement;
          }
          if (props.children) {
            if (Array.isArray(props.children)) {
              return (
                (props.children.map(findCodeElement).find(Boolean) as React.ReactElement) || null
              );
            }
            return findCodeElement(props.children);
          }
        }
        return null;
      };

      const codeElement = findCodeElement(children);

      if (codeElement && React.isValidElement(codeElement)) {
        const { children: codeContent, className } = codeElement.props as {
          children?: React.ReactNode;
          className?: string;
        };

        // Ensure we only process if it's a language block AND not mermaid
        if (className?.startsWith('language-') && className !== 'language-mermaid') {
          const lang = className.replace('language-', '');
          const code = getCodeString(codeContent);
          return <CodeBlock code={code} lang={lang} />;
        }
      }

      return (
        <pre className="mt-6 mb-4 overflow-x-auto rounded-xl glass p-5 text-sm leading-relaxed backdrop-blur-md border border-white/5">
          {children}
        </pre>
      );
    },
    a: ({ href, children }) => (
      <a
        href={href}
        className="font-bold text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary transition-all hover:bg-primary/5 px-1 -mx-1 rounded"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    table: ({ children }) => (
      <div className="my-8 w-full overflow-y-auto rounded-xl border border-primary/15 bg-code/30 backdrop-blur-md shadow-md overflow-hidden">
        <table className="w-full text-sm text-left">{children}</table>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-primary/5 border-b border-primary/10 uppercase font-bold tracking-wider text-[11px] text-primary/70">
        {children}
      </thead>
    ),
    th: ({ children }) => (
      <th className="px-6 py-4 font-bold text-content/80 whitespace-nowrap border-r border-primary/10 last:border-r-0 text-center first:text-left">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-6 py-4 text-content/75 border-b border-primary/5 border-r border-primary/5 last:border-r-0 text-sm leading-relaxed">
        {children}
      </td>
    ),
    tr: ({ children }) => (
      <tr className="last:border-0 hover:bg-primary/[0.03] transition-colors">{children}</tr>
    ),
  };
}
