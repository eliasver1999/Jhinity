import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { registry } from '@/config/registry';
import { highlight } from '@/lib/highlight';
import ComponentPreviewClient, {
  type PreviewFile,
} from './ComponentPreviewClient';

interface Props {
  name: string;
  children: React.ReactNode;
}

export default async function ComponentPreview({ name, children }: Props) {
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
    <ComponentPreviewClient files={files} deps={entry.deps}>
      {children}
    </ComponentPreviewClient>
  );
}
