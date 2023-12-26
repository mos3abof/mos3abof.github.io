module.exports = {
  content: [
    "./templates/**/*.html",
    "./theme/**/*.html",
    "./styles/**/*.css",
    './static/js/**/*.js',
  ],
  theme: {
    extend: {

    },
    keyframes: {
      'open-menu': {
        '0%': {
          transform: 'scaleY(0)',
        },
      },
      'open-menu': {
        '80%': {
          transform: 'scaleY(1.2)',
        },
      },
      'open-menu': {
        '100%': {
          transform: 'scaleY(1)',
        },
      },
    },
    anumation: {
      'open-menu': 'open-menu 0.5s ease-in-out forwards',
    },
  },
  variants: {},
  corPlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
