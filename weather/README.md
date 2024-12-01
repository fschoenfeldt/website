# Weather Experiment

This is a simple weather application that displays the current weather of a german city. It is a playground to experiment with different technologies and libraries.

## Technologies

Packages:

- React
- Vite
- Typescript
- NextUI
- TailwindCSS

APIs:

- [BrightSky](https://brightsky.dev/)
- [Nominatim](https://nominatim.org/release-docs/develop/api/Overview/)

## Running the application

```bash
pnpm install
pnpm start
```

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
