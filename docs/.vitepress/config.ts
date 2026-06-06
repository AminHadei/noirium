import { defineConfig } from 'vitepress';

const docsBase = process.env['DOCS_BASE'] ?? '/';

// eslint-disable-next-line import/no-default-export
export default defineConfig({
  title: 'Noirium UI',
  titleTemplate: ':title — Noirium UI Docs',
  description: 'Developer documentation for the Noirium UI component library.',
  base: docsBase,
  srcDir: 'content',
  cleanUrls: true,
  metaChunk: true,
  lastUpdated: true,
  // Links like [...](../src/components/X.vue) point to source files outside the
  // docs root. They resolve in IDE/GitHub but VitePress can't render them.
  ignoreDeadLinks: [/^(\.\/)?\.\.\//],
  head: [
    ['link', { rel: 'icon', href: `${docsBase}favicon.ico` }],
    [
      'link',
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: `${docsBase}icons/192.png` },
    ],
    [
      'link',
      { rel: 'icon', type: 'image/png', sizes: '512x512', href: `${docsBase}icons/512.png` },
    ],
    ['link', { rel: 'apple-touch-icon', href: `${docsBase}icons/apple-touch-icon.png` }],
    ['meta', { name: 'theme-color', content: '#171717' }],
    ['meta', { name: 'color-scheme', content: 'light dark' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Noirium UI Docs' }],
    [
      'meta',
      {
        property: 'og:description',
        content: 'Developer documentation for the Noirium UI component library.',
      },
    ],
  ],
  themeConfig: {
    logo: { src: `${docsBase}icons/192.png`, alt: 'Noirium UI', width: 24, height: 24 },
    siteTitle: 'Noirium UI',
    externalLinkIcon: true,
    editLink: {
      pattern: 'https://github.com/AminHadei/noirium/edit/main/docs/content/:path',
      text: 'Edit this page on GitHub',
    },
    docFooter: { prev: 'Previous', next: 'Next' },
    footer: {
      message: 'Noirium UI — Vue 3 component library.',
      copyright: `© ${new Date().getFullYear()} Noirium`,
    },
    nav: [
      { text: 'Getting started', link: '/getting-started' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Recipes', link: '/recipes/' },
      { text: 'Decisions', link: '/decisions/' },
      { text: 'Storybook ↗', link: 'https://aminhadei.github.io/noirium/storybook/' },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/AminHadei/noirium' }],
    sidebar: [
      {
        text: 'Foundation',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Getting started', link: '/getting-started' },
          { text: 'Architecture', link: '/architecture' },
          { text: 'Conventions', link: '/conventions' },
          { text: 'Git conventions', link: '/git-conventions' },
        ],
      },
      {
        text: 'UI',
        items: [
          { text: 'Components', link: '/components' },
          { text: 'Styling', link: '/styling' },
          { text: 'Web components', link: '/web-components' },
        ],
      },
      {
        text: 'Features',
        items: [
          { text: 'BaseBadge', link: '/features/base-badge' },
          { text: 'Modal', link: '/features/modal' },
        ],
      },
      {
        text: 'Data',
        items: [
          { text: 'API patterns', link: '/api-patterns' },
          { text: 'Storybook & MSW mocking', link: '/storybook-mocking' },
        ],
      },
      {
        text: 'Quality',
        items: [
          { text: 'Testing', link: '/testing' },
          { text: 'Vite+', link: '/vite-plus' },
          { text: 'CI', link: '/ci' },
        ],
      },
      {
        text: 'Releases',
        items: [{ text: 'Changesets & versioning', link: '/changesets' }],
      },
      {
        text: 'Recipes',
        items: [{ text: 'Overview', link: '/recipes/' }],
      },
      {
        text: 'Decisions',
        items: [
          { text: 'Overview', link: '/decisions/' },
          {
            text: '0001 — Changesets for versioning',
            link: '/decisions/0001-changesets-for-versioning',
          },
        ],
      },
    ],
    outline: { level: [2, 3] },
    search: { provider: 'local' },
  },
});
