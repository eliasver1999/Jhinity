import Link from 'next/link';
import DocsSidebar from '@/components/site/DocsSidebar';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#7F77DD] text-sm font-medium">
              J
            </div>
            <span className="text-sm font-medium">Jhinity</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm text-white/65">
            <Link href="/docs" className="hover:text-white">
              Docs
            </Link>
            <a
              href="https://github.com"
              className="hover:text-white"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-10 px-6 py-10">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-56 shrink-0 overflow-y-auto lg:block">
          <DocsSidebar />
        </aside>
        <main className="min-w-0 flex-1 max-w-3xl">{children}</main>
      </div>
    </div>
  );
}
