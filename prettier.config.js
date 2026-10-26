module.exports = {
  plugins: ["prettier-plugin-tailwindcss", "prettier-plugin-jinja-template"],
  overrides: [
    {
      files: ["*.njk"],
      options: {
        parser: "jinja-template",
      },
    },
    {
      // JSON-LD script contains {% if %} outside of JSON strings, which the
      // embedded JSON parser rejects; prettier-ignore comments don't help here
      files: ["src/_includes/seo/project_meta.njk"],
      options: {
        embeddedLanguageFormatting: "off",
      },
    },
  ],
};
