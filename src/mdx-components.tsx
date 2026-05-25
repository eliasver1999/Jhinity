import type { MDXComponents } from 'mdx/types';
import type { ComponentPropsWithoutRef } from 'react';
import ComponentPreview from '@/components/docs/ComponentPreview';

const components: MDXComponents = {
  ComponentPreview,
  h1: ({ children, ...props }: ComponentPropsWithoutRef<'h1'>) => (
    <h1
      className="mb-3 mt-8 scroll-m-20 text-4xl font-medium tracking-tight text-white"
      {...props}
    >
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: ComponentPropsWithoutRef<'h2'>) => (
    <h2
      className="mb-3 mt-10 scroll-m-20 border-b border-white/10 pb-2 text-2xl font-medium tracking-tight text-white"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: ComponentPropsWithoutRef<'h3'>) => (
    <h3
      className="mb-2 mt-8 scroll-m-20 text-xl font-medium tracking-tight text-white"
      {...props}
    >
      {children}
    </h3>
  ),
  p: ({ children, ...props }: ComponentPropsWithoutRef<'p'>) => (
    <p className="mb-4 leading-relaxed text-white/70" {...props}>
      {children}
    </p>
  ),
  a: ({ children, ...props }: ComponentPropsWithoutRef<'a'>) => (
    <a
      className="font-medium text-[#CECBF6] underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
      {...props}
    >
      {children}
    </a>
  ),
  ul: ({ children, ...props }: ComponentPropsWithoutRef<'ul'>) => (
    <ul
      className="my-4 ml-6 list-disc space-y-1.5 text-white/70 marker:text-white/30"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: ComponentPropsWithoutRef<'ol'>) => (
    <ol
      className="my-4 ml-6 list-decimal space-y-1.5 text-white/70 marker:text-white/30"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }: ComponentPropsWithoutRef<'li'>) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  blockquote: ({
    children,
    ...props
  }: ComponentPropsWithoutRef<'blockquote'>) => (
    <blockquote
      className="my-4 border-l-2 border-[#7F77DD]/60 pl-4 italic text-white/60"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => (
    <code
      className="rounded bg-white/[0.06] px-1.5 py-0.5 font-mono text-[0.85em] text-[#CECBF6]"
      {...props}
    >
      {children}
    </code>
  ),
  pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => (
    <pre
      className="my-4 overflow-x-auto rounded-lg border border-white/10 bg-white/[0.03] p-4 font-mono text-sm leading-relaxed"
      {...props}
    >
      {children}
    </pre>
  ),
  hr: (props: ComponentPropsWithoutRef<'hr'>) => (
    <hr className="my-8 border-white/10" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
