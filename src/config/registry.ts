export type ControlDef =
  | {
      name: string;
      kind: 'range';
      label: string;
      min: number;
      max: number;
      step: number;
      default: number;
    }
  | {
      name: string;
      kind: 'color';
      label: string;
      default: string;
    };

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
  controls?: ControlDef[];
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
    controls: [
      {
        name: 'colorA',
        kind: 'color',
        label: 'Inner color',
        default: '#7F77DD',
      },
      {
        name: 'colorB',
        kind: 'color',
        label: 'Outer color',
        default: '#1D9E75',
      },
      {
        name: 'radius',
        kind: 'range',
        label: 'Warp radius',
        min: 0.3,
        max: 3,
        step: 0.1,
        default: 1.5,
      },
      {
        name: 'maxPush',
        kind: 'range',
        label: 'Warp strength',
        min: 0,
        max: 2,
        step: 0.05,
        default: 0.9,
      },
      {
        name: 'rotationSpeed',
        kind: 'range',
        label: 'Rotation',
        min: 0,
        max: 3,
        step: 0.1,
        default: 1,
      },
    ],
  },
};

export type RegistrySlug = keyof typeof registry;
