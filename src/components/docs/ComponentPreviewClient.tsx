'use client';

import { useState } from 'react';

export type PreviewFile = {
  name: string;
  raw: string;
  highlighted: string;
};

interface Props {
  files: PreviewFile[];
  deps: string[];
  children: React.ReactNode;
}

type Tab = { kind: 'preview' } | { kind: 'file'; index: number };

export default function ComponentPreviewClient({
  files,
  deps,
  children,
}: Props) {
  const [tab, setTab] = useState<Tab>({ kind: 'preview' });
  const [copied, setCopied] = useState<'code' | 'install' | null>(null);

  const activeFile = tab.kind === 'file' ? files[tab.index] : null;
  const installCmd = `npm install ${deps.join(' ')}`;

  async function copy(text: string, which: 'code' | 'install') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <div className="my-6 overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] pl-2 pr-2">
        <div className="flex overflow-x-auto">
          <TabButton
            active={tab.kind === 'preview'}
            onClick={() => setTab({ kind: 'preview' })}
          >
            Preview
          </TabButton>
          {files.map((f, i) => (
            <TabButton
              key={f.name}
              active={tab.kind === 'file' && tab.index === i}
              onClick={() => setTab({ kind: 'file', index: i })}
            >
              {f.name}
            </TabButton>
          ))}
        </div>
        {activeFile && (
          <button
            onClick={() => copy(activeFile.raw, 'code')}
            className="shrink-0 rounded px-2 py-1 text-xs text-white/60 transition hover:bg-white/[0.06] hover:text-white"
          >
            {copied === 'code' ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {tab.kind === 'preview' ? (
        <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden">
          {children}
        </div>
      ) : (
        <div className="component-preview-code overflow-x-auto p-4 text-[13px] leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: activeFile!.highlighted }} />
        </div>
      )}

      {deps.length > 0 && (
        <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="mb-1.5 text-[11px] uppercase tracking-wider text-white/40">
            Install dependencies
          </div>
          <div className="flex items-center justify-between gap-3">
            <code className="truncate font-mono text-xs text-white/80">
              {installCmd}
            </code>
            <button
              onClick={() => copy(installCmd, 'install')}
              className="shrink-0 rounded px-2 py-1 text-xs text-white/60 transition hover:bg-white/[0.06] hover:text-white"
            >
              {copied === 'install' ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        'whitespace-nowrap border-b-2 px-3 py-2 text-xs font-medium transition-colors ' +
        (active
          ? 'border-[#7F77DD] text-white'
          : 'border-transparent text-white/50 hover:text-white/80')
      }
    >
      {children}
    </button>
  );
}
