/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      aspectRatio: {}
    },
    screens: {
      'mobile': '640px',
      // => @media (min-width: 640px) { ... }

      'laptop': '1280px',
      // => @media (min-width: 1024px) { ... }

      'desktop': '1920px',
      // => @media (min-width: 1280px) { ... }
      'QHD': '2560px',
      'WQHD': '3440px'
    },
    fontFamily: {
      'darkGrot': ['"Darker Grotesque"', 'sans-serif'],
      'darkGrotBlack': ['"Darker Grotesque"', 'sans-serif']
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
    require("daisyui")
  ],
}
