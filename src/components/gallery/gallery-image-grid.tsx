'use client'

import { chunkArray } from '@/lib/chunk-array'
import { GalleryImageData } from '@/lib/types'
import { styled } from '@/styled-system/jsx'
import { flex } from '@/styled-system/patterns'
import { useMemo } from 'react'
import { GalleryImageItem } from './gallery-image-item'

interface GalleryGridProps {
  images: GalleryImageData[]
  onSelect?(image: GalleryImageData): void
  onDownload?(image: GalleryImageData): void
}

const Sentinel = styled('div', {
  base: {
    height: '40px',
    position: 'absolute',
    bottom: '0',
    zIndex: '-1',
    bg: 'red',
  },
})

export const GalleryImageGrid = (props: GalleryGridProps) => {
  const { images, onDownload, onSelect } = props
  const grid = useMemo(() => chunkArray(images, 3), [images])

  return (
    <div
      className={flex({ position: 'relative', gap: '6' })}
      data-infinite-scroll
    >
      {grid.map((row, idx) => (
        <div
          key={idx}
          className={flex({ flex: '1', direction: 'column', gap: '6' })}
        >
          {row.map((image) => (
            <GalleryImageItem
              data={image}
              key={image.id}
              onDownload={() => onDownload?.(image)}
              onSelect={() => onSelect?.(image)}
            />
          ))}
        </div>
      ))}

      <Sentinel data-infinite-scroll-sentinel />
    </div>
  )
}
