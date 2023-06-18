# Orderbook svelte components

A minimal library of components for building Rain Orderbook applications using Svelte.

The goal of this library is to be totally headless, with no opinionated styling whatsoever.

Currently uses svelte-ethers-store, however this will likely be upgraded soon to be compatible with viem and wagmi-core.

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

Everything inside `src/lib` is part of the library, everything inside `src/routes` is for demos.