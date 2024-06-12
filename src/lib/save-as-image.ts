export const saveAsImage = (url: string, fileName: string) => {
  fetch(url)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new Blob([blob], { type: 'image/jpeg' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(file)
      link.href = url
      link.download = fileName

      // link.click() doesn't work in firefox
      link.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      )

      queueMicrotask(() => {
        link.remove()
        URL.revokeObjectURL(url)
      })
    })
}
