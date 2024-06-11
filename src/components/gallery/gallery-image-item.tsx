import { GalleryImageData } from '@/lib/types'
import { css, cx } from '@/styled-system/css'
import { styled } from '@/styled-system/jsx'
import { hstack } from '@/styled-system/patterns'
import Image from 'next/image'
import { Button } from '../ui/button'

interface GalleryImageProps {
  data: GalleryImageData
  onSelect?(): void
  onDownload?(): void
}

export const GalleryImageItem = (props: GalleryImageProps) => {
  const { data, onSelect, onDownload } = props
  const aspectRatio = (data.width / data.height).toFixed(2)
  return (
    <figure
      className={cx('group', css({ position: 'relative', cursor: 'zoom-in' }))}
      onClick={onSelect}
      style={{ aspectRatio }}
    >
      <Image
        fill
        className={css({ objectFit: 'cover', height: '200px' })}
        src={data.download_url}
        alt={data.author}
      />

      <Backdrop />

      <ActionOverlay>
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
            onClick={onDownload}
          >
            Download
          </Button>
        </div>
      </ActionOverlay>
    </figure>
  )
}

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
    opacity: 0,
    transition: 'opacity 0.2s',
    _groupHover: {
      opacity: 1,
    },
  },
})
