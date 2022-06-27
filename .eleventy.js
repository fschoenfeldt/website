const htmlmin = require("html-minifier");
const UpgradeHelper = require("@11ty/eleventy-upgrade-help");
const sharpPlugin = require("eleventy-plugin-sharp");

module.exports = function (eleventyConfig) {
  /**
   * Upgrade helper
   * Uncomment if you need help upgrading to new major version.
   */
  //eleventyConfig.addPlugin(UpgradeHelper);

  // https://www.11ty.dev/docs/languages/nunjucks/#generic-global
  eleventyConfig.addNunjucksGlobal(
    "personal_address",
    process.env.PERSONAL_ADDRESS
  );
  eleventyConfig.addNunjucksGlobal(
    "personal_phone",
    process.env.PERSONAL_PHONE
  );
  eleventyConfig.addNunjucksGlobal(
    "personal_actual_vacation_date",
    process.env.PERSONAL_ACTUAL_VACATION_DATE
  );
  eleventyConfig.addNunjucksGlobal(
    "personal_vacation_date",
    process.env.PERSONAL_VACATION_DATE
  );
  eleventyConfig.addNunjucksGlobal(
    "external_vacation_date",
    process.env.EXTERNAL_VACATION_DATE
  );

  /**
   * https://github.com/luwes/eleventy-plugin-sharp
   */
  pathPrefix = "/html/website/";
  eleventyConfig.addPlugin(
    sharpPlugin({
      urlPath: `${pathPrefix}/img`,
      outputDir: "./_site/img",
    })
  );

  /**
   * Files to copy
   * https://www.11ty.dev/docs/copy/
   */
  eleventyConfig.addPassthroughCopy("src/img");

  /**
   * HTML Minifier for production builds
   */
  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_ENV == "production" &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });

  return {
    dir: {
      input: "src",
      data: "../_data",
    },
    pathPrefix: pathPrefix,
  };
};
