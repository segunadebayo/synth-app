# Synth App

The goal of this app is to recreate the functionalty in [Pexels](https://www.pexels.com/) where you scroll through a list of images, preview and download them.

> See the state machine diagram [here](https://stately.ai/registry/editor/ea8c0f61-7013-449c-9294-1ca08dc32792?machineId=6904225e-a217-4dd6-85a7-00cc989aad87&mode=design)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Built With

- [Next.js](https://nextjs.org/) as the framework
- [Zag.js](https://zagjs.com/) for modeling the gallery
- [Panda CSS](https://panda-css.com/) for styling

## Improvement Ideas

Given more time, I would like to:

- Test the application on mobile and tablet devices, fixing any issues
- Consider using Context API for `gallery.tsx` instead of prop drilling
- Write a end-to-end test using [Playwright](https://playwright.dev/)
- Improve keyboard accessibility, masonry grids are notorious for being difficult to navigate with a keyboard.
