const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{njk,md}"],
  theme: {
    screens: {
      ...defaultTheme.screens,
      xs: "400px",
    },
    fontSize: {
      ...defaultTheme.fontSize,
      "10xl": "9rem",
      "11xl": "10rem",
      "12xl": "11rem",
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.stone,
      slate: colors.slate,
      blue: colors.sky,
      cyan: colors.cyan,
      amber: colors.amber,
      red: colors.red,
      green: colors.green,
      laufmaus: {
        accent: "#F8FD97",
        complement: "#40412E",
      },
    },
    extend: {
      screens: {
        canDisplayA4: { raw: "(min-width: 875px)" },
      },
      fontFamily: {
        serif: ["Merriweather", ...defaultTheme.fontFamily.serif],
        heading: ["Anton", ...defaultTheme.fontFamily.sans],
        space: ["Space Mono", ...defaultTheme.fontFamily.sans],
        spacegrotesk: ["Space Grotesk", ...defaultTheme.fontFamily.sans],
        dotted: ["Doto", ...defaultTheme.fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            h2: {
              marginTop: `1.5rem`,
            },
            "tbody tr:nth-child(even)": {
              backgroundColor: theme("colors.gray.100"),
            },
            // typography zeroes the outer cell padding, which glues text to a striped row's edge
            "thead th:first-child, tbody td:first-child": {
              paddingInlineStart: "0.5em",
            },
            "thead th:last-child, tbody td:last-child": {
              paddingInlineEnd: "0.5em",
            },
          },
        },
        invert: {
          css: {
            "tbody tr:nth-child(even)": {
              backgroundColor: theme("colors.gray.800"),
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
