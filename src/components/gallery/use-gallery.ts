'use client'

import { fetchImages } from '@/lib/fetch-images'
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

function galleryMachine(incomingContext: Partial<GalleryContext> = {}) {
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
          return ctx.images[ctx.selectedIndex] || null
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
          return ctx.currentPage < ctx.totalPages
        },
      },

      activities: {
        setupInfiniteScroll(_ctx, _evt, { send }) {
          const root = document.querySelector('[data-infinite-scroll]')
          const sentinel = root?.querySelector(
            '[data-infinite-scroll-sentinel]'
          )

          if (!root || !sentinel) return

          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                send('scroll.bottom')
              }
            },
            { root, threshold: 0.2 }
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

        triggerDownload(ctx) {
          if (!ctx.currentImage) return
          const link = document.createElement('a')
          link.href = ctx.currentImage.download_url
          link.download = `${ctx.currentImage.id}.jpg`

          // link.click() doesn't work in firefox
          link.dispatchEvent(
            new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
            })
          )

          queueMicrotask(() => {
            link.remove()
          })
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
      },
    }
  )
}

export function useGallery() {
  const [state, send] = useMachine(galleryMachine())

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
    onDownload() {
      send('click.download')
    },
    onSelect(index: number) {
      send({ type: 'click.image', index })
    },
    onDismiss() {
      send('dimiss')
    },
  }
}
