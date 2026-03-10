import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://yucklys.github.io',
  base: '/TabIt',
  integrations: [
    starlight({
      title: 'TabIt',
      description: 'Smart Tab Manager for Chrome',
      logo: {
        src: './public/TabIt128.png',
        alt: 'TabIt Logo',
      },
      favicon: '/favicon.png',
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Yucklys/TabIt',
        },
      ],
      sidebar: [
        {
          label: 'Guides',
          items: [
            { label: 'Getting Started', slug: 'guides/getting-started' },
            { label: 'Features', slug: 'guides/features' },
            { label: 'Settings', slug: 'guides/settings' },
          ],
        },
        {
          label: 'Reference',
          items: [
            { label: 'Privacy Policy', slug: 'reference/privacy-policy' },
            { label: 'Changelog', slug: 'reference/changelog' },
          ],
        },
      ],
      editLink: {
        baseUrl: 'https://github.com/Yucklys/TabIt/edit/main/docs/',
      },
    }),
  ],
});
