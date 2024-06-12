import { Gallery } from '@/components/gallery/gallery'
import { fetchImages } from '@/lib/fetch-images'
import { css } from '@/styled-system/css'
import { container, stack } from '@/styled-system/patterns'

export default async function Page() {
  // pre-fetch images on the server
  const images = await fetchImages()

  return (
    <div className={container({ maxWidth: '8xl' })}>
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

      <Gallery defaultImages={images} />
    </div>
  )
}
