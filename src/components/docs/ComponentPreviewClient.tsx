'use client';

import { useState, type ComponentType, type ReactNode } from 'react';
import type { ControlDef } from '@/config/registry';

export type PreviewFile = {
  name: string;
  raw: string;
  highlighted: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DemoComponent = ComponentType<any>;

interface Props {
  files: PreviewFile[];
  deps: string[];
  controls: ControlDef[];
  demo?: DemoComponent;
  children?: ReactNode;
}

type Tab = { kind: 'preview' } | { kind: 'file'; index: number };

function defaultsFor(controls: ControlDef[]): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const c of controls) {
    out[c.name] = c.default;
  }
  return out;
}

export default function ComponentPreviewClient({
  files,
  deps,
  controls,
  demo,
  children,
}: Props) {
  const [tab, setTab] = useState<Tab>({ kind: 'preview' });
  const [copied, setCopied] = useState<'code' | 'install' | null>(null);
  const [values, setValues] = useState<Record<string, unknown>>(() =>
    defaultsFor(controls)
  );

  const activeFile = tab.kind === 'file' ? files[tab.index] : null;
  const installCmd = `npm install ${deps.join(' ')}`;
  const DemoComponent = demo;
  const showControls =
    controls.length > 0 && DemoComponent && tab.kind === 'preview';

  async function copy(text: string, which: 'code' | 'install') {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      // clipboard unavailable — no-op
    }
  }

  function reset() {
    setValues(defaultsFor(controls));
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
          {DemoComponent ? <DemoComponent {...values} /> : children}
        </div>
      ) : (
        <div className="component-preview-code overflow-x-auto p-4 text-[13px] leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: activeFile!.highlighted }} />
        </div>
      )}

      {showControls && (
        <div className="border-t border-white/10 bg-white/[0.02] px-4 py-3">
          <div className="mb-2.5 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wider text-white/40">
              Controls
            </div>
            <button
              onClick={reset}
              className="text-xs text-white/50 transition hover:text-white"
            >
              Reset
            </button>
          </div>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {controls.map((c) => (
              <Control
                key={c.name}
                def={c}
                value={values[c.name]}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, [c.name]: v }))
                }
              />
            ))}
          </div>
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

function Control({
  def,
  value,
  onChange,
}: {
  def: ControlDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (def.kind === 'range') {
    const v = typeof value === 'number' ? value : def.default;
    return (
      <label className="flex items-center gap-3 text-xs">
        <span className="w-24 shrink-0 text-white/60">{def.label}</span>
        <input
          type="range"
          min={def.min}
          max={def.max}
          step={def.step}
          value={v}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 accent-[#7F77DD]"
        />
        <span className="w-10 shrink-0 text-right font-mono text-white/80">
          {v.toFixed(2)}
        </span>
      </label>
    );
  }
  const v = typeof value === 'string' ? value : def.default;
  return (
    <label className="flex items-center gap-3 text-xs">
      <span className="w-24 shrink-0 text-white/60">{def.label}</span>
      <input
        type="color"
        value={v}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-10 shrink-0 cursor-pointer rounded border border-white/15 bg-transparent"
      />
      <span className="flex-1 font-mono text-white/80">{v}</span>
    </label>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
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
