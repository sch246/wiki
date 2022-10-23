// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Sch246\'s Wiki',
  tagline: '^_^',
  url: 'https://sch246.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.ico',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'sch246', // Usually your GitHub org/user name.
  projectName: 'wiki', // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'zh-Hans',
    locales: ['zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/sch246/wiki/edit/main/',
          routeBasePath: "/",
          sidebarCollapsible: true, //默认折叠
          showLastUpdateTime: false,
          showLastUpdateAuthor: false,
          breadcrumbs: false,
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/sch246/wiki/edit/main/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      //sidebarCollapsible: true, //默认折叠
      image: 'img/logo.png',

      navbar: {
        title: 'sch246\'s Wiki',
        hideOnScroll: false,
        logo: {
          alt: 'Logo',
          src: 'img/logo.svg',
        },
        items: [{
          to: "Other/start",
          label: "其它",
          position: "left",
        },
        {
          to: "Computer/start",
          label: "计算机",
          position: "left",
        },
        {
          to: "Math/start",
          label: "数学",
          position: "left",
        },
        {
          to: "MC/start",
          label: "MC",
          position: "left",
        },
        {
          to: "IL/start",
          label: "IL",
          position: "left",
        },

        {
          to: "blog",
          label: "博客",
          position: "right",
        },
        {
          href: 'https://github.com/sch246/wiki',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
        ],
      },
      footer: {
        style: 'light',
        links: [
          {
            href: "http://sch246.top:2333/",
            label: "旧站",
          },
          {
            href: "https://nav.sch246.com/",
            label: "友链 & 导航站",
          },
          {
            label: '资源仓库',
            href: 'https://github.com/sch246/File-host',
          },
          {
            label: '资源仓库2',
            href: 'http://cloud.sch246.top:2333/s/goUY',
          },
          // {
          //   title: 'Docs',
          //   items: [
          //     {
          //       label: 'Tutorial',
          //       to: '/docs/intro',
          //     },
          //   ],
          // },
          // {
          //   title: 'Community',
          //   items: [
          //     {
          //       label: 'Stack Overflow',
          //       href: 'https://stackoverflow.com/questions/tagged/docusaurus',
          //     },
          //     {
          //       label: 'Discord',
          //       href: 'https://discordapp.com/invite/docusaurus',
          //     },
          //     {
          //       label: 'Twitter',
          //       href: 'https://twitter.com/docusaurus',
          //     },
          //   ],
          // },
          // {
          //   title: 'More',
          //   items: [
          //     {
          //       label: 'Blog',
          //       to: '/blog',
          //     },
          //     {
          //       label: 'GitHub',
          //       href: 'https://github.com/facebook/docusaurus',
          //     },
          //   ],
          // },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} sch246, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
