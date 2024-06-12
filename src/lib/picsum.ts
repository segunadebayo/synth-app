import { saveAsImage } from './save-as-image'

export interface PicsumImage {
  id: string
  author: string
  width: number
  height: number
  url: string
  download_url: string
  index: number
}

export async function fetchImages(
  page = 1,
  perPage = 30
): Promise<PicsumImage[]> {
  const url = `https://picsum.photos/v2/list?page=${page}&limit=${perPage}`
  return fetch(url)
    .then((res) => res.json())
    .then((data: PicsumImage[]) => {
      return data.map((image, idx) => {
        const index = (page - 1) * perPage + idx
        return { ...image, index }
      })
    })
}

export function getImageUrl(id: string, width: number, height: number) {
  return `https://picsum.photos/id/${id}/${width}/${height}`
}

export function getImageAspect(image: PicsumImage) {
  return (image.width / image.height).toFixed(2)
}

export function getCompressedImageSize(image: PicsumImage, factor = 6.5) {
  return {
    width: Math.round(image.width / factor),
    height: Math.round(image.height / factor),
  }
}

export function downloadImage(image: PicsumImage) {
  const fileName = `synth-app-${image.author}-${image.id}.jpg`
  saveAsImage(image.download_url, fileName.toLowerCase())
}
