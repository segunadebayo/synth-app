import { createMachine } from '@zag-js/core'

interface Image {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
}

interface GalleryContext {
  images: Image[]
  currentPage: number
  selectedIndex: number
  totalPages: number
  readonly currentImage: Image | null
}

interface GalleryState {
  value: 'idle' | 'previewing'
}

export function galleryMachine(incomingContext: Partial<GalleryContext> = {}) {
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
          activities: ['trackOutsideClick'],
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
          if (!root) return

          const observer = new IntersectionObserver(
            (entries) => {
              if (entries[0].isIntersecting) {
                send('scroll.bottom')
              }
            },
            { root, threshold: 0.2 }
          )

          observer.observe(root.lastElementChild as Element)

          return () => {
            observer.disconnect()
          }
        },

        trackOutsideClick(_ctx, _evt, { send }) {
          const handleClick = (mouseEvent: MouseEvent) => {
            const target = mouseEvent.composedPath?.()[0] ?? mouseEvent.target
            if (!(target instanceof Element)) return
            if (!target.closest('[data-preview-dialog]')) {
              send({ type: 'dimiss', src: 'click-outside' })
            }
          }

          document.addEventListener('click', handleClick)

          return () => {
            document.removeEventListener('click', handleClick)
          }
        },
      },

      actions: {
        loadNextPage(ctx) {
          ctx.currentPage++
          const url = `https://picsum.photos/v2/list?page=${ctx.currentPage}`
          fetch(url)
            .then((res) => res.json())
            .then((images) => {
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
