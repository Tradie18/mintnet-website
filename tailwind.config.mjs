/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}',
    './src/components/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'
  ],
  theme: {
    extend: {
      colors: {
        // Royal Dragon Theme
        'royal': {
          'primary': '#9a0aab',    // Brand color, buttons, links
          'secondary': '#b83cc7',  // Hover states, highlights
          'dark': '#7a0889',       // Active states, shadows
        },
        
        // Background Colors
        'dark': {
          'deepest': '#0a0a0f',
          'deep': '#1a1a2e', 
          'medium': '#2d2d44',
          'light': '#3d3d5c',
        },
        
        // Text Colors
        'text': {
          'primary': '#f8f8ff',
          'secondary': '#d1d1e0',
          'muted': '#9999b3',
        },
        
        // Accent Colors
        'accent': {
          'purple': '#c45adb',
          'cyan': '#4dd0e1',
          'gold': '#ffd700',
        },
        
        // Status Colors
        'status': {
          'success': '#00a86b',
          'warning': '#ff9500',
          'error': '#ff4757',
          'info': '#4dd0e1',
        },
        
        // Legacy colors for compatibility (will be phased out)
        'mint': {
          'white': '#f8f8ff',
          'darkgray': '#1a1a2e',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'heading': ['Rajdhani', 'sans-serif'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        },
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'twinkle': 'twinkle 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '1' },
        }
      },
      backgroundImage: {
        'radial-dark': 'radial-gradient(circle at center, #2d2d44 0%, #1a1a2e 50%, #0a0a0f 100%)',
        'gradient-royal': 'linear-gradient(135deg, #9a0aab 0%, #b83cc7 50%, #c45adb 100%)',
      },
      typography: {
        DEFAULT: {
          css: {
            'max-width': 'none',
            color: '#f8f8ff',
            '--tw-prose-headings': '#f8f8ff',
            '--tw-prose-lead': '#d1d1e0',
            '--tw-prose-links': '#9a0aab',
            '--tw-prose-bold': '#f8f8ff',
            '--tw-prose-counters': '#d1d1e0',
            '--tw-prose-bullets': '#d1d1e0',
            '--tw-prose-hr': '#9a0aab',
            '--tw-prose-quotes': '#d1d1e0',
            '--tw-prose-quote-borders': '#9a0aab',
            'font-family': 'Inter, sans-serif',
            h1: {
              'font-family': 'Rajdhani, sans-serif',
              'font-weight': '600',
              'font-size': '2.25em',
              'margin-top': '2em',
              'margin-bottom': '0.8em',
              'line-height': '1.1'
            },
            h2: {
              'font-family': 'Rajdhani, sans-serif',
              'font-weight': '600',
              'font-size': '1.75em',
              'margin-top': '1.75em',
              'margin-bottom': '0.6em',
              'line-height': '1.2'
            },
            h3: {
              'font-family': 'Rajdhani, sans-serif',
              'font-weight': '500',
              'font-size': '1.5em',
              'margin-top': '1.5em',
              'margin-bottom': '0.6em',
            },
            h4: {
              'font-family': 'Rajdhani, sans-serif',
              'font-weight': '500',
              'margin-top': '1.5em',
              'margin-bottom': '0.5em',
            },
            p: {
              'margin-top': '1.25em',
              'margin-bottom': '1.25em',
              'line-height': '1.7',
              'letter-spacing': '0.01em',
            },
            li: {
              'margin-top': '0.5em',
              'margin-bottom': '0.5em',
            },
            'blockquote p': {
              'font-style': 'italic',
              'font-weight': '400',
              'line-height': '1.6',
              'color': '#d1d1e0',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}