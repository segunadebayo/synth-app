'use client'

import { ChevronLeftIcon } from '@/icons/chevron-left'
import { ChevronRightIcon } from '@/icons/chevron-right'
import { XIcon } from '@/icons/x'
import { GalleryImageData } from '@/lib/types'
import { useDialog } from '@/lib/use-dialog'
import { css } from '@/styled-system/css'
import { Float } from '@/styled-system/jsx'
import { hstack, stack } from '@/styled-system/patterns'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'

interface GalleryImagePreviewProps {
  image: GalleryImageData | null
  open?: boolean
  onClose?(): void
  onClickNext?(): void
  onClickPrev?(): void
  onDownload?(): void
}

export const GalleryImagePreview = (props: GalleryImagePreviewProps) => {
  const { image, open, onClickNext, onClickPrev, onClose, onDownload } = props

  const ref = useDialog({ open, onClose })

  if (!image) return null

  return (
    <Dialog ref={ref}>
      <div className={stack({ gap: '10' })}>
        <div className={hstack({ justify: 'space-between' })}>
          <div>
            <p className={css({ fontWeight: 'medium' })}>{image.author}</p>
            <div
              className={css({
                color: 'gray.500',
                textStyle: 'xs',
                lineClamp: '1',
              })}
            >
              {image.width}px x {image.height}px
            </div>
          </div>

          <Button variant="primary" onClick={() => onDownload?.()}>
            Download free
          </Button>
        </div>

        <Image
          className={css({
            height: { md: '64dvh', lg: '75dvh' },
            objectFit: 'contain',
            marginInline: 'auto',
          })}
          height={image.height}
          width={image.width}
          src={image.download_url}
          alt={image.author}
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
          <Float
            placement="top-end"
            offsetX={{ base: '8', md: '-8' }}
            offsetY={{ base: '-8', md: '0' }}
          >
            <Button size="icon" variant="ghost">
              <XIcon />
            </Button>
          </Float>
        </form>
      </div>
    </Dialog>
  )
}
