module.exports = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-nunjucks"],
  overrides: [
    {
      files: ["*.njk", "*.nunjucks", "*.nunj"],
      options: {
        parser: "nunjucks",
      },
    },
  ],
};
