module.exports = {
  content: [
    "./templates/**/*.html",
    "./theme/**/*.html",
    "./styles/input.css"
  ],
  theme: {},
  variants: {},
  corPlugins: {
    aspectRatio: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
