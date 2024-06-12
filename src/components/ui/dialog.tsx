import { styled } from '@/styled-system/jsx'

export const Dialog = styled('dialog', {
  base: {
    position: 'fixed',
    top: { base: 'unset', md: '10' },
    background: 'white',
    shadow: { base: 'bottom', md: 'md' },
    bottom: { base: '0', md: 'unset' },
    borderRadius: 'md',
    maxWidth: 'unset',
    marginInline: 'auto',
    overflow: 'visible',
    color: 'gray.900',
    _backdrop: {
      background: 'black/50',
      pointerEvents: 'none',
    },
  },

  variants: {
    size: {
      md: {
        padding: '5',
        insetInline: { base: '0', md: '100px', lg: '150px' },
      },
    },
  },

  defaultVariants: {
    size: 'md',
  },
})
