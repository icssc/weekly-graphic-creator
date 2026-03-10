# ICSSC Weekly Graphic Generator

Copy + paste Consortium Event messages and programmatically generate weekly graphics!

## How to Use

1. Navigate to the current deployment (https://icssc.link/create-weekly)
2. Follow the on-screen instructions. This usually involves copy+pasting Discord messages,
choosing background colors, and setting the graphic name.
3. Click on the button to save the graphic (works best in Chromium-based browsers such as Brave),
or use your browser's built-in screenshot tools (I like Arc's and Firefox's) to capture the graphic.

## Setup/Running Locally

1. Clone the repo
2. `bun install` (you can probably also get away with npm or pnpm, but I used bun to create this project)
3. `bun run dev` (or `npm run dev` or `pnpm dev`)
4. Go to the URL logged in the console.

## Adding Club Images

Club images are stored in `public/club-logos/`.
- For consistency, all images are 312x312 or 312x228.

Club names are mapped to images by removing a `@ UCI` or `at UCI` suffix. For example:
- `ICSSC` will look for `icssc.png`
- `AI@UCI` will look for `ai.png`
- `AISUCI` (no @) will look for `aisuci.png`

To add a club logo, simply add an image with size 312x312 or 312x228 to the `public/club-logos` folder.
- Feel free to do this without running locally, though auto-deployments are not set up yet.

## Development TODOs

- Auto-deploy to GitHub pages since it's a static site
- Add lint & formatting GitHub Actions checks
- Add asset file size + dimension checks

# Template: React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
