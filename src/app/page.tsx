import { GalleryImageGrid } from '@/components/gallery/gallery-image-grid'
import { GalleryImagePreview } from '@/components/gallery/gallery-image-preview'
import { fetchImages } from '@/lib/fetch-images'
import { css } from '@/styled-system/css'
import { stack } from '@/styled-system/patterns'

export default async function Page() {
  const images = await fetchImages(1, 12)
  const firstImage = images[0]

  return (
    <div className={css({ padding: '40px' })}>
      <div className={css({ maxWidth: '6xl', mx: 'auto' })}>
        <div className={stack({ mb: '10', pt: '20', pb: '4' })}>
          <h1
            className={css({
              textStyle: '2xl',
              letterSpacing: 'tight',
              fontWeight: 'semibold',
            })}
          >
            Synth App
          </h1>
          <p className={css({ color: 'gray.500' })}>
            A collection of beautiful synthwave images
          </p>
        </div>

        <GalleryImageGrid images={images} />
        <GalleryImagePreview open images={images} currentImage={firstImage} />
      </div>
    </div>
  )
}
