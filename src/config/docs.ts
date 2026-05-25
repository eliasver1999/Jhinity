export type DocsNavItem = {
  title: string;
  href: string;
  badge?: 'new' | 'pro';
};

export type DocsNavSection = {
  title: string;
  items: DocsNavItem[];
};

export const docsNav: DocsNavSection[] = [
  {
    title: 'Getting Started',
    items: [{ title: 'Introduction', href: '/docs' }],
  },
  {
    title: 'Components',
    items: [
      {
        title: 'Particle Field',
        href: '/docs/components/particle-field',
        badge: 'new',
      },
    ],
  },
];
