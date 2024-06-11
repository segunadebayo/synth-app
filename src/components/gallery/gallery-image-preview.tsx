'use client'

import { ChevronLeftIcon } from '@/icons/chevron-left'
import { ChevronRightIcon } from '@/icons/chevron-right'
import { XIcon } from '@/icons/x-icon'
import { GalleryImageData } from '@/lib/types'
import { useDialog } from '@/lib/use-dialog'
import { css } from '@/styled-system/css'
import { Float } from '@/styled-system/jsx'
import { hstack, stack, wrap } from '@/styled-system/patterns'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'

interface ImagePreviewDialogProps {
  images: GalleryImageData[]
  currentImage: GalleryImageData
  open?: boolean
  onClose?(): void
  onClickNext?(): void
  onClickPrev?(): void
}

export const GalleryImagePreview = (props: ImagePreviewDialogProps) => {
  const { images, currentImage, open, onClickNext, onClickPrev, onClose } =
    props

  // related images = first 5 images from the same author
  const relatedImages = images
    .filter((image) => image.author === currentImage.author)
    .slice(0, 5)

  const ref = useDialog({ open, onClose })

  return (
    <Dialog ref={ref}>
      <div className={stack({ gap: '6' })}>
        <div className={hstack({ justify: 'space-between' })}>
          <div>
            <p className={css({ fontWeight: 'medium' })}>
              {currentImage.author}
            </p>
            <div className={css({ color: 'gray.500', textStyle: 'xs' })}>
              {currentImage.width}px x {currentImage.height}px
            </div>
          </div>

          <Button size="md" variant="primary">
            Download free
          </Button>
        </div>

        <Image
          className={css({ borderRadius: 'md' })}
          height={currentImage.height}
          width={currentImage.width}
          src={currentImage.download_url}
          alt={currentImage.author}
        />

        <Float placement="middle-start" offsetX="-8" css={{ hideBelow: 'md' }}>
          <Button size="icon" variant="ghost" onClick={onClickPrev}>
            <ChevronLeftIcon />
          </Button>
        </Float>

        <Float placement="middle-end" offsetX="-8" css={{ hideBelow: 'md' }}>
          <Button size="icon" variant="ghost" onClick={onClickNext}>
            <ChevronRightIcon />
          </Button>
        </Float>

        <form method="dialog">
          <Float placement="top-end" offsetX="-8" css={{ hideBelow: 'md' }}>
            <Button size="icon" variant="ghost">
              <XIcon />
            </Button>
          </Float>
        </form>

        {relatedImages.length && (
          <div className={stack({ gap: '4', mt: '6' })}>
            <p className={css({ fontWeight: 'medium', color: 'gray.600' })}>
              More like this 🚀
            </p>
            <div className={wrap({ gap: '4' })}>
              {relatedImages.map((image) => (
                <Image
                  key={image.url}
                  className={css({ borderRadius: 'md' })}
                  height={100}
                  width={100}
                  src={image.download_url}
                  alt={image.author}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
