import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { ComponentType, ReactNode } from 'react';
import { registry } from '@/config/registry';
import { highlight } from '@/lib/highlight';
import ComponentPreviewClient, {
  type PreviewFile,
} from './ComponentPreviewClient';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DemoComponent = ComponentType<any>;

interface Props {
  name: string;
  demo?: DemoComponent;
  children?: ReactNode;
}

export default async function ComponentPreview({
  name,
  demo,
  children,
}: Props) {
  const entry = registry[name];
  if (!entry) {
    throw new Error(
      `ComponentPreview: no registry entry for "${name}". Add it to src/config/registry.ts.`
    );
  }

  const files: PreviewFile[] = await Promise.all(
    entry.files.map(async (f) => {
      const raw = await readFile(join(process.cwd(), f.relPath), 'utf8');
      const highlighted = await highlight(raw, f.lang ?? 'tsx');
      return { name: f.name, raw, highlighted };
    })
  );

  return (
    <ComponentPreviewClient
      files={files}
      deps={entry.deps}
      controls={entry.controls ?? []}
      componentName={entry.componentName}
      demo={demo}
    >
      {children}
    </ComponentPreviewClient>
  );
}
