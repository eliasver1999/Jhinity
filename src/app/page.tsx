import Link from 'next/link';
import ParticleFieldCanvas from '@/components/hero/ParticleFieldCanvas';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-white">
      {/* Background particles */}
      <ParticleFieldCanvas />

      {/* Foreground content */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <nav className="flex items-center justify-between px-7 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#7F77DD] text-sm font-medium">
              J
            </div>
            <span className="text-sm font-medium">Jhinity</span>
          </Link>
          <div className="flex items-center gap-5 text-sm text-white/65">
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
          </div>
        </nav>

        <section className="mx-auto flex max-w-2xl flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-[#7F77DD]/40 bg-[#7F77DD]/15 px-2.5 py-1 text-xs text-[#CECBF6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#97C459]" />
            Launching August 2026
          </div>

          <h1 className="mb-4 text-5xl font-medium leading-[1.1] tracking-tight">
            Premium 3D React
            <br />
            components for SaaS
          </h1>

          <p className="mb-7 max-w-md text-base leading-relaxed text-white/65">
            Drop-in animated hero sections, shader backgrounds, and interactive
            3D scenes. Built with React Three Fiber. Copy, paste, ship.
          </p>

          <form className="flex w-full max-w-sm gap-2">
            <input
              type="email"
              required
              placeholder="you@company.com"
              className="flex-1 rounded-md border border-white/15 bg-black/40 px-3.5 py-2.5 text-sm backdrop-blur-md placeholder:text-white/40 transition-colors focus:border-white/40 focus:bg-black/60 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-md bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              Get notified
            </button>
          </form>

          <p className="mt-3 text-xs text-white/40">
            First 100 subscribers get 30% off Pro.
          </p>
        </section>
      </div>
    </main>
  );
}