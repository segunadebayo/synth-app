import { styled } from '@/styled-system/jsx'

export const Button = styled('button', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontWeight: 'medium',
    transition: 'background-color 0.2s, color 0.2s',
  },

  variants: {
    variant: {
      primary: {
        bg: 'blue.600',
        color: 'white',
        _hover: {
          bg: 'blue.700',
        },
      },
      secondary: {
        bg: 'gray.200',
        color: 'gray.800',
        _hover: {
          bg: 'gray.300',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'white/80',
        _hover: {
          color: 'white',
        },
      },
    },

    size: {
      icon: {
        width: '16',
        height: '16',
      },
      md: {
        fontSize: 'sm',
        borderRadius: 'md',
        paddingInline: '4',
        paddingBlock: '2',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
