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
        title: 'Distorted Sphere',
        href: '/docs/components/distorted-sphere',
        badge: 'new',
      },
      {
        title: 'Wave Mesh',
        href: '/docs/components/wave-mesh',
        badge: 'new',
      },
      {
        title: 'Floating Objects',
        href: '/docs/components/floating-objects',
        badge: 'new',
      },
      {
        title: 'Shader Gradient',
        href: '/docs/components/shader-gradient',
        badge: 'new',
      },
      {
        title: 'Particle Field',
        href: '/docs/components/particle-field',
        badge: 'new',
      },
    ],
  },
];
