/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-selected': 'var(--color-surface-selected)',
        border: 'var(--color-border)',
        'border-strong': 'var(--color-border-strong)',
        inverse: 'var(--color-inverse)',
        'on-inverse': 'var(--color-on-inverse)',
      },
      spacing: {
        half: '2px',
        one: '4px',
        two: '8px',
        three: '16px',
        four: '24px',
        five: '32px',
        six: '64px',
      },
      borderRadius: {
        chip: '6px',
        field: '10px',
        button: '12px',
        card: '14px',
        monogram: '10px',
      },
      fontSize: {
        title: '28px',
        section: '12px',
        body: '16px',
        meta: '13px',
        button: '16px',
        metric: '34px',
      },
      letterSpacing: {
        section: '1.2px',
      },
    },
  },
  plugins: [],
};
