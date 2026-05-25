'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { docsNav } from '@/config/docs';

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-7 text-sm">
      {docsNav.map((section) => (
        <div key={section.title}>
          <div className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-white/40">
            {section.title}
          </div>
          {section.items.length === 0 ? (
            <div className="px-2 py-1.5 text-white/30 italic">
              Coming soon
            </div>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        'flex items-center justify-between rounded-md px-2 py-1.5 transition-colors ' +
                        (active
                          ? 'bg-white/[0.06] text-white'
                          : 'text-white/60 hover:bg-white/[0.04] hover:text-white')
                      }
                    >
                      <span>{item.title}</span>
                      {item.badge === 'pro' && (
                        <span className="rounded bg-[#7F77DD]/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#CECBF6]">
                          Pro
                        </span>
                      )}
                      {item.badge === 'new' && (
                        <span className="rounded bg-[#97C459]/20 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[#97C459]">
                          New
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ))}
    </nav>
  );
}
