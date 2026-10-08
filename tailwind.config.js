/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        surface: 'var(--color-surface)',
        'surface-raised': 'var(--color-surface-raised)',
        border: 'var(--color-border)',
        text: 'var(--color-text)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',
        accent: 'var(--color-accent)',
        'accent-soft': 'var(--color-accent-soft)',
        'on-accent': 'var(--color-on-accent)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        shadow: 'var(--color-shadow)',
      },
      spacing: {
        screen: '20px',
        list: '12px',
      },
      borderRadius: {
        chip: '8px',
        field: '12px',
        button: '14px',
        card: '16px',
      },
      fontSize: {
        // Escala da identidade: 3 pesos apenas (400, 600, 700).
        title: ['28px', { lineHeight: '34px' }],
        cardTitle: ['17px', { lineHeight: '22px' }],
        body: ['15px', { lineHeight: '21px' }],
        bodyStrong: ['15px', { lineHeight: '21px' }],
        // Digitação e rótulo de botão em 16px (evita o zoom do iOS ao focar um campo).
        field: ['16px', { lineHeight: '22px' }],
        button: ['16px', { lineHeight: '22px' }],
        legend: ['12px', { lineHeight: '16px' }],
        metric: ['22px', { lineHeight: '28px' }],
        day: ['26px', { lineHeight: '30px' }],
      },
      letterSpacing: {
        legend: '0.4px',
      },
    },
  },
  plugins: [],
};