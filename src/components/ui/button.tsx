import { styled } from '@/styled-system/jsx'

export const Button = styled('button', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  variants: {
    variant: {
      primary: {
        bg: 'purple.800',
        color: 'white',
      },
      secondary: {
        bg: 'gray.200',
      },
    },

    size: {
      md: {
        borderRadius: 'md',
        paddingInline: '2',
        paddingBlock: '4',
      },
    },
  },
})
