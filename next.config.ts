import type { NextConfig } from 'next';
import createMDX from '@next/mdx';

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [
      [
        'rehype-pretty-code',
        {
          theme: 'github-dark-dimmed',
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
