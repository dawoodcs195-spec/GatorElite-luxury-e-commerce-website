import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0A',
        gold: { 
          DEFAULT: '#C9A96E', 
          light: '#D4BA85', 
          dark: '#B89B5A' 
        },
        bronze: '#B87333',
        cream: '#F5F0E8',
        onyx: '#0A0A0A',
        navy: { 
          DEFAULT: '#080D1A', 
          light: '#0F1A2E', 
          dark: '#040710' 
        },
        espresso: '#120A07',
        cognac: '#181008',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-navy': 'linear-gradient(135deg, #0A0A0A 0%, #080D1A 50%, #0A0A0A 100%)',
      },
      boxShadow: {
        'glow-gold': '0 0 30px rgba(201, 169, 110, 0.2)',
        'glow-navy': '0 0 60px rgba(8, 13, 26, 0.5)',
      },
    },
  },
  plugins: [],
};
export default config;
