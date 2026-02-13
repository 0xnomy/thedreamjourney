/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                cream: '#FAF8F3',
                slate: {
                    900: '#1E1E1E',
                    600: '#555555',
                },
                amber: {
                    900: '#8B5E3C',
                    700: '#B89B72',
                },
                'border-light': '#E5E0D8',
            },
            fontFamily: {
                serif: ['var(--font-playfair)', 'serif'],
                sans: ['var(--font-inter)', 'sans-serif'],
            },
            spacing: {
                18: '4.5rem',
                22: '5.5rem',
            },
            transitionDuration: {
                150: '150ms',
                200: '200ms',
            },
            maxWidth: {
                '6xl': '64rem',
            },
        },
    },
    plugins: [],
}
