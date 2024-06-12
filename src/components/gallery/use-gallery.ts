'use client'

import { fetchImages } from '@/lib/fetch-images'
import { saveAsImage } from '@/lib/save-as-image'
import { GalleryImageData } from '@/lib/types'
import { createMachine } from '@zag-js/core'
import { useMachine } from '@zag-js/react'

interface PrivateContext {
  totalPages: number
  breakpoint?: 'mobile' | 'desktop'
  mounted: boolean
  readonly currentImage: GalleryImageData | null
}

interface PublicContext {
  images: GalleryImageData[]
  currentPage: number
  selectedIndex: number
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
        selectedIndex: -1,
        totalPages: 30,
        ...incomingContext,
        breakpoint: undefined,
        mounted: false,
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
            'breakpoint.set': {
              target: 'idle:temp',
              actions: ['setMounted', 'setCurrentBreakpoint'],
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
            'breakpoint.set': {
              actions: ['setMounted', 'setCurrentBreakpoint'],
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
            send({ type: 'breakpoint.set', breakpoint })
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

export function useGallery(props: { images: GalleryImageData[] }) {
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
