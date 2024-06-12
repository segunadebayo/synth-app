import { styled } from '@/styled-system/jsx'

export const Button = styled('button', {
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    fontWeight: 'medium',
    transition: 'background-color 0.2s, color 0.2s',
    outline: 'none',
    userSelect: 'none',
    pointerEvents: 'auto',
  },

  variants: {
    variant: {
      primary: {
        bg: 'blue.600',
        color: 'white',
        _hover: {
          bg: 'blue.700',
        },
        _focusVisible: {
          outline: '2px solid {colors.blue.300}',
          outlineOffset: '2px',
        },
      },
      secondary: {
        bg: 'gray.200',
        color: 'gray.800',
        _hover: {
          bg: 'gray.300',
        },
        _focusVisible: {
          outline: '2px solid {colors.gray.300}',
          outlineOffset: '2px',
        },
      },
      ghost: {
        bg: 'transparent',
        color: 'white/80',
        _hover: {
          color: 'white',
        },
        _focusVisible: {
          outline: '2px solid {colors.white/80}',
        },
      },
    },

    size: {
      icon: {
        width: '16',
        height: '16',
        borderRadius: 'md',
      },
      'icon-sm': {
        width: '8',
        height: '8',
        borderRadius: 'md',
        '& svg': {
          width: '3',
          height: '3',
        },
      },
      md: {
        fontSize: 'sm',
        borderRadius: 'md',
        paddingInline: '4',
        paddingBlock: '2',
      },
      sm: {
        fontSize: 'xs',
        borderRadius: 'sm',
        paddingInline: '3',
        paddingBlock: '1',
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
})
