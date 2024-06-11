import { styled } from '@/styled-system/jsx'

export const Dialog = styled('dialog', {
  base: {
    position: 'fixed',
    top: { md: '20' },
    background: 'white',
    shadow: { base: 'bottom', md: 'md' },
    bottom: { base: '0', md: 'unset' },
    borderRadius: 'md',
    width: 'full',
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
      medium: {
        padding: { base: '4', md: '10' },
        maxWidth: '3xl',
      },
    },
  },

  defaultVariants: {
    size: 'medium',
  },
})