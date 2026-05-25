export type RegistryFile = {
  name: string;
  relPath: string;
  lang?: string;
};

export type RegistryEntry = {
  slug: string;
  title: string;
  files: RegistryFile[];
  deps: string[];
};

export const registry: Record<string, RegistryEntry> = {
  'particle-field': {
    slug: 'particle-field',
    title: 'Particle Field',
    files: [
      {
        name: 'ParticleFieldCanvas.tsx',
        relPath: 'src/components/hero/ParticleFieldCanvas.tsx',
      },
      {
        name: 'ParticleField.tsx',
        relPath: 'src/components/hero/ParticleField.tsx',
      },
    ],
    deps: ['three', '@react-three/fiber'],
  },
};

export type RegistrySlug = keyof typeof registry;
