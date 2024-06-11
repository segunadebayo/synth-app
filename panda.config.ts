import { defineConfig } from '@pandacss/dev'

export default defineConfig({
  preflight: true,
  include: ['./src/**/*.{js,jsx,ts,tsx}'],
  exclude: [],
  outdir: 'styled-system',
  jsxFramework: 'react',
  jsxStyleProps: 'minimal',

  theme: {
    extend: {
      tokens: {
        spacing: {
          'safe-bottom': { value: 'env(safe-area-inset-bottom, 0px)' },
        },
        shadows: {
          bottom: { value: '4px 0px 8px rgba(0, 0, 0, 0.1)' },
        },
      },
    },
  },

  globalCss: {
    body: {
      minHeight: '100dvh',
      overflowX: 'hidden',
    },
  },
})
