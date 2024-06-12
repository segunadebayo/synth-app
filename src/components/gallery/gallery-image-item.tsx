'use client'

import { DownloadIcon } from '@/icons/download'
import { GalleryImageData } from '@/lib/types'
import { css } from '@/styled-system/css'
import { styled } from '@/styled-system/jsx'
import { hstack } from '@/styled-system/patterns'
import Image from 'next/image'
import { Button } from '../ui/button'

interface GalleryImageProps {
  data: GalleryImageData
  onSelect?(): void
  onDownload?(): void
}

export const GalleryImageItem = (props: GalleryImageProps) => {
  const { data, onSelect, onDownload } = props
  const aspectRatio = (data.width / data.height).toFixed(2)
  return (
    <Figure className="group" onClick={onSelect} style={{ aspectRatio }}>
      <Image
        fill
        quality={50}
        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw"
        className={css({ objectFit: 'cover' })}
        src={data.download_url}
        alt={data.author}
      />
      <HoverOverlay css={{ hideBelow: 'md' }} />
      <ActionOverlay css={{ hideBelow: 'md' }}>
        <div className={hstack({ width: 'full', justify: 'space-between' })}>
          <div
            className={css({
              fontWeight: 'medium',
              fontSize: 'sm',
              lineClamp: '1',
            })}
          >
            {data.author}
          </div>
          <Button
            size="sm"
            variant="secondary"
            onClick={(event) => {
              event.stopPropagation()
              onDownload?.()
            }}
          >
            Download
          </Button>
        </div>
      </ActionOverlay>

      <ActionOverlay static css={{ hideFrom: 'md' }}>
        <Button
          size="icon-sm"
          variant="secondary"
          onClick={(event) => {
            event.stopPropagation()
            onDownload?.()
          }}
        >
          <DownloadIcon />
        </Button>
      </ActionOverlay>
    </Figure>
  )
}

const Figure = styled('figure', {
  base: {
    position: 'relative',
    cursor: 'pointer',
    background: 'gray.300',
    userSelect: 'none',
  },
})

const HoverOverlay = styled('div', {
  base: {
    opacity: 0,
    transition: 'opacity 0.2s',
    position: 'absolute',
    inset: '0',
    pointerEvents: 'none',
    _groupHover: {
      opacity: 1,
      backgroundImage:
        'linear-gradient(180deg, #00000057 0%, #0000001a 50%, #00000059 100%)',
    },
  },
})

const ActionOverlay = styled('div', {
  base: {
    display: 'flex',
    direction: 'column',
    alignItems: 'flex-end',
    padding: '4',
    position: 'absolute',
    inset: '0',
    color: 'white',
    pointerEvents: 'none',
  },

  variants: {
    static: {
      true: {
        justifyContent: 'flex-end',
      },
      false: {
        opacity: 0,
        transition: 'opacity 0.2s',
        _groupHover: {
          opacity: 1,
        },
      },
    },
  },

  defaultVariants: {
    static: false,
  },
})
