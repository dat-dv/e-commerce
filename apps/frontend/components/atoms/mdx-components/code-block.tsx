import { codeToHtml } from 'shiki';

import { cn } from '@/utils/cn';

import { CopyButton } from '../coppy-button';
const TOKENS = {
  padding: 'p-8',
  border: 'border-primary/15',
  borderHover: 'hover:border-primary/30',
} as const;

const preClass = cn(
  'mt-6 mb-4 overflow-x-auto rounded-xl glass',
  'bg-code/50 transition-all border-primary/15 hover:border-primary/30 shadow-xl shadow-primary/5',
  '[&>code]:!bg-transparent [&>code]:!p-0 [&_span]:!font-mono',
  TOKENS.padding,
  'dark:bg-code/60',
);

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export async function CodeBlock({ code, lang = 'typescript' }: CodeBlockProps) {
  const normalizedLang = lang.replace('language-', '').toLowerCase() || 'text';

  let html = '';
  try {
    html = await codeToHtml(code.trim(), {
      lang: normalizedLang,
      themes: {
        light: 'github-light-default',
        dark: 'dracula',
      },
      transformers: [
        {
          pre(node) {
            this.addClassToHast(node, preClass);
            delete node.properties.style;
            return node;
          },
          code(node) {
            return node;
          },
        },
      ],
    });
  } catch (error) {
    console.error('Shiki highlighting failed:', error);
  }

  if (!html) {
    return (
      <div className={cn('group relative', preClass)}>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <CopyButton code={code} />
        </div>
        <pre className="text-white/60 font-mono">
          <code>{code}</code>
        </pre>
      </div>
    );
  }

  return (
    <div className="group relative">
      <div className="absolute top-5 right-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-all z-10 pointer-events-none">
        <span className="text-[10px] uppercase font-black tracking-[0.2em] text-white/30">
          {normalizedLang}
        </span>
        <div className="pointer-events-auto">
          <CopyButton code={code} />
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
