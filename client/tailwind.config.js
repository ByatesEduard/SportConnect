/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                brand: {
                    DEFAULT: '#24ae7c',
                    hover: '#1d9a6c',
                    dim: 'rgba(36,174,124,0.12)',
                },
                surface: {
                    DEFAULT: '#13161d',
                    2: '#1a1e27',
                },
                border: {
                    focus: '#24ae7c',
                },
            },
        },
    },
    plugins: [require('@tailwindcss/line-clamp')],
}
