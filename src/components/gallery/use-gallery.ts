'use client'

import { fetchImages } from '@/lib/fetch-images'
import { saveAsImage } from '@/lib/save-as-image'
import { GalleryImageData } from '@/lib/types'
import { createMachine } from '@zag-js/core'
import { useMachine } from '@zag-js/react'

interface GalleryContext {
  images: GalleryImageData[]
  currentPage: number
  selectedIndex: number
  totalPages: number
  readonly currentImage: GalleryImageData | null
}

interface GalleryState {
  value: 'idle' | 'previewing'
}

function galleryStateMachine(incomingContext: Partial<GalleryContext> = {}) {
  return createMachine<GalleryContext, GalleryState>(
    {
      context: {
        totalPages: 30,
        images: [],
        currentPage: 1,
        selectedIndex: -1,
        ...incomingContext,
      },

      computed: {
        currentImage(ctx) {
          if (ctx.selectedIndex === -1) return null
          return ctx.images[ctx.selectedIndex]
        },
      },

      on: {
        'click.download': {
          actions: ['triggerDownload'],
        },
      },

      initial: 'idle',

      states: {
        idle: {
          activities: ['setupInfiniteScroll'],
          on: {
            'scroll.bottom': {
              actions: ['loadNextPage'],
            },
            'click.image': {
              target: 'previewing',
              actions: ['setCurrentImage'],
            },
          },
        },

        previewing: {
          exit: ['clearCurrentImage'],
          on: {
            dimiss: {
              target: 'idle',
            },
            'click.next': [
              {
                guard: 'hasNextImage',
                actions: ['showNextImage'],
              },
              {
                actions: ['loadNextPage', 'showNextImage'],
              },
            ],
            'click.prev': {
              actions: ['showPrevImage'],
            },
          },
        },
      },
    },
    {
      guards: {
        hasNextImage(ctx) {
          return ctx.selectedIndex < ctx.images.length - 1
        },
      },

      activities: {
        setupInfiniteScroll(_ctx, _evt, { send }) {
          const sentinel = document?.querySelector(
            '[data-infinite-scroll-sentinel]'
          )

          if (!sentinel) return

          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                send('scroll.bottom')
              }
            },
            { threshold: 0.2 }
          )

          observer.observe(sentinel)

          return () => {
            observer.disconnect()
          }
        },
      },

      actions: {
        loadNextPage(ctx) {
          ctx.currentPage++
          fetchImages(ctx.currentPage).then((images) => {
            ctx.images.push(...images)
          })
        },

        triggerDownload(ctx, evt) {
          const image = evt.image || ctx.currentImage
          if (!image) return
          saveAsImage(
            image.download_url,
            `synth-app-${image.author}-${image.id}.jpg`
          )
        },

        showNextImage(ctx) {
          ctx.selectedIndex = Math.min(
            ctx.selectedIndex + 1,
            ctx.images.length - 1
          )
        },

        showPrevImage(ctx) {
          ctx.selectedIndex = Math.max(ctx.selectedIndex - 1, 0)
        },

        setCurrentImage(ctx, evt) {
          ctx.selectedIndex = evt.index
        },

        clearCurrentImage(ctx) {
          ctx.selectedIndex = -1
        },
      },
    }
  )
}

export function useGallery(props: { images: GalleryImageData[] }) {
  const { images } = props
  const [state, send] = useMachine(
    galleryStateMachine({ images, currentPage: 1 })
  )

  return {
    images: state.context.images,
    currentImage: state.context.currentImage,
    isPreviewing: state.matches('previewing'),
    onClickNext() {
      send('click.next')
    },
    onClickPrev() {
      send('click.prev')
    },
    onDownload(image?: GalleryImageData) {
      send({ type: 'click.download', image })
    },
    onSelect(index: number) {
      send({ type: 'click.image', index })
    },
    onDismiss() {
      send('dimiss')
    },
  }
}
