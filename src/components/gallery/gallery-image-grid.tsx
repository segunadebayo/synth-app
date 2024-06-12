'use client'

import { GalleryImageData } from '@/lib/types'
import { styled } from '@/styled-system/jsx'
import { GalleryImageItem } from './gallery-image-item'
import { useMemo } from 'react'

interface GalleryGridProps {
  images: GalleryImageData[]
  onSelect?(image: GalleryImageData): void
  onDownload?(image: GalleryImageData): void
}

const createColumns = (images: GalleryImageData[], numCols: number) => {
  const cols: GalleryImageData[][] = []
  for (let i = 0; i < numCols; i++) cols[i] = []
  images.forEach((image, i) => {
    cols[i % numCols].push(image)
  })
  return cols
}

export const GalleryImageGrid = (props: GalleryGridProps) => {
  const { images, onDownload, onSelect } = props
  const cols = useMemo(() => createColumns(images, 3), [images])

  return (
    <Grid data-infinite-scroll>
      {cols.map((col, i) => (
        <Col key={i}>
          {col.map((image) => (
            <GalleryImageItem
              key={image.id}
              data={image}
              onDownload={() => onDownload?.(image)}
              onSelect={() => onSelect?.(image)}
            />
          ))}
        </Col>
      ))}

      <Sentinel data-infinite-scroll-sentinel />
    </Grid>
  )
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

const Grid = styled('div', {
  base: {
    '--gutter': { base: 'spacing.4', md: 'spacing.6' },
    display: 'grid',
    gridTemplateColumns: {
      base: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
    },
    marginInlineEnd: {
      base: 'calc(-1 * var(--gutter))',
      md: '0',
    },
    gridAutoFlow: 'column',
    position: 'relative',
    gridGap: 'var(--gutter)',
  },
})

const Col = styled('div', {
  base: {
    display: 'grid',
    gridAutoRows: 'max-content',
    gridGap: 'var(--gutter)',
  },
})
