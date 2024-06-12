'use client'

import type { PicsumImage } from '@/lib/picsum'
import { styled } from '@/styled-system/jsx'
import { useMemo } from 'react'
import { GalleryImageItem } from './gallery-image-item'

interface GalleryGridProps {
  /**
   * The images to display in the grid
   */
  images: PicsumImage[]
  /**
   * Callback when an image is clicked
   */
  onSelect?(image: PicsumImage): void
  /**
   * Callback when an image's download button is clicked
   */
  onDownload?(image: PicsumImage): void
  /**
   * The breakpoint to render the grid ats
   */
  breakpoint?: 'mobile' | 'desktop'
}

export const GalleryImageGrid = (props: GalleryGridProps) => {
  const { images, onDownload, onSelect, breakpoint } = props

  const columns = useMemo(
    () => createColumns(images, breakpoint === 'desktop' ? 3 : 2),
    [images, breakpoint]
  )

  return (
    <ImageGrid
      breakpoint={breakpoint}
      data-infinite-scroll
      data-breakpoint={breakpoint}
    >
      {columns.map((column, i) => (
        <ImageColumn key={i}>
          {column.map((image) => (
            <GalleryImageItem
              key={image.id}
              image={image}
              onDownload={() => onDownload?.(image)}
              onSelect={() => onSelect?.(image)}
            />
          ))}
        </ImageColumn>
      ))}

      <Sentinel data-infinite-scroll-sentinel />
    </ImageGrid>
  )
}

const createColumns = (images: PicsumImage[], numCols: number) => {
  const cols: PicsumImage[][] = []
  for (let i = 0; i < numCols; i++) cols[i] = []
  images.forEach((image, i) => {
    cols[i % numCols].push(image)
  })
  return cols
}

const Sentinel = styled('div', {
  base: {
    height: '50dvh',
    position: 'absolute',
    bottom: '0',
    insetX: '0',
    zIndex: '1',
  },
})

const ImageGrid = styled('div', {
  base: {
    '--gutter': { base: 'spacing.4', md: 'spacing.6' },
    display: 'grid',
    gridTemplateColumns: 'repeat(var(--columns), minmax(0, 1fr))',
    gridAutoFlow: 'column',
    position: 'relative',
    gridGap: 'var(--gutter)',
    maxWidth: '100%',
  },
  variants: {
    breakpoint: {
      mobile: {
        '--columns': '2',
        hideFrom: 'md',
      },
      desktop: {
        '--columns': '3',
        hideBelow: 'md',
      },
    },
  },
})

const ImageColumn = styled('div', {
  base: {
    display: 'grid',
    gridAutoRows: 'max-content',
    gridGap: 'var(--gutter)',
  },
})
