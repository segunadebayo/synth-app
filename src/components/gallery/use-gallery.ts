'use client'

import { downloadImage, fetchImages, type PicsumImage } from '@/lib/picsum'
import { createMachine } from '@zag-js/core'
import { useMachine } from '@zag-js/react'

interface PrivateContext {
  totalPages: number
  breakpoint?: 'mobile' | 'desktop'
  mounted: boolean
  currentImage: PicsumImage | null
}

interface PublicContext {
  images: PicsumImage[]
  currentPage: number
}

interface GalleryContext extends PublicContext, PrivateContext {}

interface GalleryState {
  value: 'idle' | 'idle:temp' | 'previewing'
}

function galleryStateMachine(incomingContext: Partial<PublicContext> = {}) {
  return createMachine<GalleryContext, GalleryState>(
    {
      context: {
        images: [],
        currentPage: 1,
        ...incomingContext,
        totalPages: 30,
        currentImage: null,
        breakpoint: undefined,
        mounted: false,
      },

      on: {
        'click.download': {
          actions: ['triggerDownload'],
        },
      },

      initial: 'idle',

      entry: ['setMounted'],

      activities: ['setupBreakpointObserver'],

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
            'breakpoint.change': {
              target: 'idle:temp',
              actions: ['setCurrentBreakpoint'],
            },
          },
        },

        // when the breakpoint changes, we need to restart the infinite scroll
        // hence the temporary state.
        'idle:temp': {
          after: {
            0: 'idle',
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
            'breakpoint.change': {
              actions: ['setCurrentBreakpoint'],
            },
          },
        },
      },
    },
    {
      guards: {
        hasNextImage(ctx) {
          const selectedIndex = ctx.currentImage?.index
          if (selectedIndex == null) return false
          return selectedIndex < ctx.images.length - 1
        },
      },

      activities: {
        setupBreakpointObserver(ctx, _evt, { send }) {
          const exec = () => {
            const { matches } = window.matchMedia('(min-width: 48rem)')
            const breakpoint = matches ? 'desktop' : 'mobile'

            // sync overlay size with the body, this is a hack for scroll restoration
            const overlay = document.querySelector<HTMLElement>(
              '[data-infinite-scroll-overlay]'
            )
            if (overlay) {
              overlay.style.width = document.body.clientWidth + 'px'
              overlay.style.height = document.body.clientHeight + 'px'
            }

            if (ctx.breakpoint === breakpoint) return
            send({ type: 'breakpoint.change', breakpoint })
          }

          exec()

          const observer = new ResizeObserver(exec)
          observer.observe(document.body)
          return () => {
            observer.disconnect()
          }
        },
        setupInfiniteScroll(ctx, _evt, { send }) {
          const sentinel = document?.querySelector(
            `[data-breakpoint=${ctx.breakpoint}] [data-infinite-scroll-sentinel]`
          )

          if (!sentinel) return

          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
              send('scroll.bottom')
            }
          })

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
          downloadImage(image)
        },
        showNextImage(ctx) {
          const selectedIndex = ctx.currentImage?.index || 0
          const nextIndex = Math.min(selectedIndex + 1, ctx.images.length - 1)
          ctx.currentImage = ctx.images[nextIndex] || null
        },
        showPrevImage(ctx) {
          const selectedIndex = ctx.currentImage?.index || 0
          const prevIndex = Math.max(selectedIndex - 1, 0)
          ctx.currentImage = ctx.images[prevIndex] || null
        },
        setCurrentImage(ctx, evt) {
          ctx.currentImage = ctx.images[evt.index] || null
        },
        clearCurrentImage(ctx) {
          ctx.currentImage = null
        },
        setCurrentBreakpoint(ctx, evt) {
          ctx.breakpoint = evt.breakpoint
        },
        setMounted(ctx) {
          ctx.mounted = true
        },
      },
    }
  )
}

export function useGallery(props: { images: PicsumImage[] }) {
  const { images } = props
  const [state, send] = useMachine(
    galleryStateMachine({ images, currentPage: 1 })
  )

  const breakpoint = state.context.breakpoint
  const mounted = state.context.mounted

  return {
    images: state.context.images,
    currentImage: state.context.currentImage,
    isPreviewing: state.matches('previewing'),
    renderMobile: !mounted ? true : breakpoint === 'mobile',
    renderDesktop: !mounted ? true : breakpoint === 'desktop',
    onClickNext() {
      send('click.next')
    },
    onClickPrev() {
      send('click.prev')
    },
    onDownload(image?: PicsumImage) {
      send({ type: 'click.download', image })
    },
    onSelect(image: PicsumImage) {
      send({ type: 'click.image', index: image.index })
    },
    onDismiss() {
      send('dimiss')
    },
  }
}
