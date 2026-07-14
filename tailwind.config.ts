import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'gr-forest': '#0D2B1A',
        'gr-gold': '#C8A84B',
        'gr-cream': '#f8f5ef',
        'gr-light-green': '#1A4A2E',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0px',
      },
    },
  },
};

export default config;
