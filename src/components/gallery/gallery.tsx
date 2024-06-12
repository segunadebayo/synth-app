'use client'

import { GalleryImageData } from '@/lib/types'
import { GalleryImageGrid } from './gallery-image-grid'
import { GalleryImagePreview } from './gallery-image-preview'
import { useGallery } from './use-gallery'

interface GalleryProps {
  defaultImages: GalleryImageData[]
}

export const Gallery = (props: GalleryProps) => {
  const { defaultImages } = props
  const state = useGallery({ images: defaultImages })
  return (
    <>
      <GalleryImageGrid
        images={state.images}
        onDownload={state.onDownload}
        onSelect={(image) => {
          const idx = state.images.findIndex((img) => img.id === image.id)
          state.onSelect(idx)
        }}
      />

      <GalleryImagePreview
        open={state.isPreviewing}
        image={state.currentImage}
        onClose={state.onDismiss}
        onClickNext={state.onClickNext}
        onClickPrev={state.onClickPrev}
        onDownload={state.onDownload}
      />
    </>
  )
}
