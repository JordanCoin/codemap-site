import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://codemap.build',
  integrations: [
    starlight({
      title: 'codemap docs',
      description: 'codemap resolves what your code imports, tells you what breaks if you change it, and says when it does not know.',
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/JordanCoin/codemap' }],
      sidebar: [
        { label: 'Overview', slug: 'docs' },
        { label: 'Install and setup', slug: 'docs/install' },
        { label: 'Commands', slug: 'docs/commands' },
        { label: 'Coverage contract', slug: 'docs/coverage' },
        { label: 'MCP server', slug: 'docs/mcp' },
        { label: 'Hooks', slug: 'docs/hooks' },
        { label: 'CI action (codemap-ci)', slug: 'docs/ci' },
        { label: 'Output standard', slug: 'docs/output-standard' },
      ],
      customCss: ['./src/styles/docs.css'],
    }),
  ],
});
