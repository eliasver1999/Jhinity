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
  /** JSX tag emitted by the Copy props button. Omit to hide the button. */
  componentName?: string;
  files: RegistryFile[];
  deps: string[];
  controls?: ControlDef[];
};

export const registry: Record<string, RegistryEntry> = {
  'hover-reveal-card': {
    slug: 'hover-reveal-card',
    title: 'Hover Reveal Card',
    componentName: 'HoverRevealCardDemo',
    files: [
      {
        name: 'HoverRevealCard.tsx',
        relPath: 'src/components/cards/HoverRevealCard.tsx',
      },
      {
        name: 'HoverRevealMaterial.tsx',
        relPath: 'src/components/cards/HoverRevealMaterial.tsx',
      },
      {
        name: 'HoverRevealCardDemo.tsx',
        relPath: 'src/components/cards/HoverRevealCardDemo.tsx',
      },
    ],
    deps: ['three', '@react-three/fiber', '@react-three/drei'],
    controls: [
      { name: 'colorA', kind: 'color', label: 'Color A', default: '#7F77DD' },
      { name: 'colorB', kind: 'color', label: 'Color B', default: '#EC4899' },
      {
        name: 'speed',
        kind: 'range',
        label: 'Speed',
        min: 0,
        max: 2,
        step: 0.05,
        default: 0.5,
      },
    ],
  },
  'tilt-card': {
    slug: 'tilt-card',
    title: 'Tilt Card',
    componentName: 'TiltCardDemo',
    files: [
      {
        name: 'TiltCard.tsx',
        relPath: 'src/components/cards/TiltCard.tsx',
      },
      {
        name: 'TiltCardDemo.tsx',
        relPath: 'src/components/cards/TiltCardDemo.tsx',
      },
    ],
    deps: [],
    controls: [
      {
        name: 'maxTilt',
        kind: 'range',
        label: 'Max tilt',
        min: 0,
        max: 30,
        step: 1,
        default: 12,
      },
      {
        name: 'perspective',
        kind: 'range',
        label: 'Perspective',
        min: 300,
        max: 2500,
        step: 50,
        default: 1000,
      },
      {
        name: 'glareIntensity',
        kind: 'range',
        label: 'Glare',
        min: 0,
        max: 1,
        step: 0.05,
        default: 0.4,
      },
      {
        name: 'scale',
        kind: 'range',
        label: 'Hover scale',
        min: 1,
        max: 1.1,
        step: 0.01,
        default: 1.02,
      },
    ],
  },
  'distorted-sphere': {
    slug: 'distorted-sphere',
    title: 'Distorted Sphere',
    componentName: 'DistortedSphereCanvas',
    files: [
      {
        name: 'DistortedSphereCanvas.tsx',
        relPath: 'src/components/hero/DistortedSphereCanvas.tsx',
      },
      {
        name: 'DistortedSphere.tsx',
        relPath: 'src/components/hero/DistortedSphere.tsx',
      },
    ],
    deps: ['three', '@react-three/fiber', '@react-three/drei'],
    controls: [
      { name: 'color', kind: 'color', label: 'Color', default: '#7F77DD' },
      {
        name: 'distort',
        kind: 'range',
        label: 'Distort',
        min: 0,
        max: 1,
        step: 0.02,
        default: 0.4,
      },
      {
        name: 'speed',
        kind: 'range',
        label: 'Speed',
        min: 0,
        max: 3,
        step: 0.05,
        default: 1,
      },
    ],
  },
  'wave-mesh': {
    slug: 'wave-mesh',
    title: 'Wave Mesh',
    componentName: 'WaveMeshCanvas',
    files: [
      {
        name: 'WaveMeshCanvas.tsx',
        relPath: 'src/components/hero/WaveMeshCanvas.tsx',
      },
      {
        name: 'WaveMesh.tsx',
        relPath: 'src/components/hero/WaveMesh.tsx',
      },
    ],
    deps: ['three', '@react-three/fiber'],
    controls: [
      { name: 'colorA', kind: 'color', label: 'Peak', default: '#7F77DD' },
      { name: 'colorB', kind: 'color', label: 'Trough', default: '#1D9E75' },
      {
        name: 'amplitude',
        kind: 'range',
        label: 'Amplitude',
        min: 0,
        max: 2,
        step: 0.05,
        default: 1.2,
      },
      {
        name: 'frequency',
        kind: 'range',
        label: 'Frequency',
        min: 0.2,
        max: 3,
        step: 0.05,
        default: 0.4,
      },
      {
        name: 'speed',
        kind: 'range',
        label: 'Speed',
        min: 0,
        max: 2,
        step: 0.05,
        default: 1.0,
      },
    ],
  },
  'floating-objects': {
    slug: 'floating-objects',
    title: 'Floating Objects',
    componentName: 'FloatingObjectsCanvas',
    files: [
      {
        name: 'FloatingObjectsCanvas.tsx',
        relPath: 'src/components/hero/FloatingObjectsCanvas.tsx',
      },
      {
        name: 'FloatingObjects.tsx',
        relPath: 'src/components/hero/FloatingObjects.tsx',
      },
    ],
    deps: ['three', '@react-three/fiber'],
    controls: [
      {
        name: 'colorA',
        kind: 'color',
        label: 'Primary',
        default: '#7F77DD',
      },
      {
        name: 'colorB',
        kind: 'color',
        label: 'Secondary',
        default: '#EC4899',
      },
      {
        name: 'parallaxStrength',
        kind: 'range',
        label: 'Parallax',
        min: 0,
        max: 1.5,
        step: 0.05,
        default: 0.5,
      },
      {
        name: 'speed',
        kind: 'range',
        label: 'Speed',
        min: 0,
        max: 2,
        step: 0.05,
        default: 1,
      },
    ],
  },
  'shader-gradient': {
    slug: 'shader-gradient',
    title: 'Shader Gradient',
    componentName: 'ShaderGradientCanvas',
    files: [
      {
        name: 'ShaderGradientCanvas.tsx',
        relPath: 'src/components/hero/ShaderGradientCanvas.tsx',
      },
      {
        name: 'ShaderGradient.tsx',
        relPath: 'src/components/hero/ShaderGradient.tsx',
      },
    ],
    deps: ['three', '@react-three/fiber', '@react-three/drei'],
    controls: [
      {
        name: 'colorA',
        kind: 'color',
        label: 'Top-left',
        default: '#7F77DD',
      },
      {
        name: 'colorB',
        kind: 'color',
        label: 'Top-right',
        default: '#EC4899',
      },
      {
        name: 'colorC',
        kind: 'color',
        label: 'Bottom-right',
        default: '#06B6D4',
      },
      {
        name: 'colorD',
        kind: 'color',
        label: 'Bottom-left',
        default: '#F59E0B',
      },
      {
        name: 'speed',
        kind: 'range',
        label: 'Speed',
        min: 0,
        max: 2,
        step: 0.05,
        default: 0.4,
      },
      {
        name: 'scale',
        kind: 'range',
        label: 'Scale',
        min: 0.5,
        max: 4,
        step: 0.1,
        default: 1.5,
      },
      {
        name: 'mouseIntensity',
        kind: 'range',
        label: 'Spotlight',
        min: 0,
        max: 1.5,
        step: 0.05,
        default: 0.6,
      },
    ],
  },
  'particle-field': {
    slug: 'particle-field',
    title: 'Particle Field',
    componentName: 'ParticleFieldCanvas',
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
