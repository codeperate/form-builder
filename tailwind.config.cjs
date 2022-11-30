const colors = require('tailwindcss/colors');
function columns(number) {
    const arr = [...Array(number).keys()];
    return arr.map(i => `cfb-col-span-${i + 1} des:cfb-col-span-${i + 1}`);
}
/** @type {import('tailwindcss').Config} */
module.exports = {
    prefix: 'cfb-',
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    safelist: [...columns(12)],
    theme: {
        colors: {
            main: colors.sky,
            danger: colors.red,
            success: colors.green,
            valid: colors.sky,
            warning: colors.yellow,
            white: colors.white,
            black: colors.black,
            gray: colors.gray,
        },
        screens: {
            mob: '640px',
            tab: '768px',
            des: '1024px',
        },
    },
    plugins: [
        function ({ addVariant }) {
            addVariant('children', '& > *');
        },
    ],
};
