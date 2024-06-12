'use client'

import { GalleryImageData } from '@/lib/types'
import { GalleryImageGrid } from './gallery-image-grid'
import { GalleryImagePreview } from './gallery-image-preview'
import { useGallery } from './use-gallery'

interface GalleryProps {
  defaultImages: GalleryImageData[]
}

/*
    Question that comes to mind: Why are we render the grid twice? Short answer: to masonory grids are hard 😅

    Goal: Solve the masonry grid in a way that works for both SSR and CSR
    - SSR: render both mobile and desktop grids, hiding the one that doesn't match the breakpoint using CSS
    - CSR: After hydration, remove the grid that doesn't match the breakpoint using JS

    To test this, turn off JS to see if the SSR version works as expected.
    Then turn JS back on and resize the window to see if the CSR version works as expected.

    Ideally, we should use grid-template-columns=masonry, but that's not supported in all browsers
*/

export const Gallery = (props: GalleryProps) => {
  const { defaultImages } = props
  const state = useGallery({ images: defaultImages })

  return (
    <div>
      {state.renderMobile && (
        <GalleryImageGrid
          breakpoint="mobile"
          images={state.images}
          onDownload={state.onDownload}
          onSelect={(image) => {
            const idx = state.images.findIndex((img) => img.id === image.id)
            state.onSelect(idx)
          }}
        />
      )}

      {state.renderDesktop && (
        <GalleryImageGrid
          breakpoint="desktop"
          images={state.images}
          onDownload={state.onDownload}
          onSelect={(image) => {
            const idx = state.images.findIndex((img) => img.id === image.id)
            state.onSelect(idx)
          }}
        />
      )}

      {/* Used to preserve scroll positions. See use-gallery L123 */}
      <div
        data-infinite-scroll-overlay
        style={{
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
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
    </div>
  )
}
