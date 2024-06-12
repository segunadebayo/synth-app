'use client'

import { GalleryImageData } from '@/lib/types'
import { css, cx } from '@/styled-system/css'
import { styled } from '@/styled-system/jsx'
import { hstack } from '@/styled-system/patterns'
import Image from 'next/image'
import { Button } from '../ui/button'
import { DownloadIcon } from '@/icons/download'

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
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className={css({ objectFit: 'cover' })}
        src={data.download_url}
        alt={data.author}
      />

      <Backdrop css={{ hideBelow: 'md' }} />

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
            type="button"
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
        <Button size="icon-sm" variant="secondary">
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
    bg: 'gray.100',
    userSelect: 'none',
  },
})

const Backdrop = styled('div', {
  base: {
    opacity: 0,
    transition: 'opacity 0.2s',
    position: 'absolute',
    inset: '0',
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
