'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

export function useDialog(open: boolean | undefined) {
  const ref = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return

    // open dialog in blocking mode
    dialog?.showModal()

    // block scroll (simple version, not perfect)
    const doc = dialog?.ownerDocument ?? document
    doc.body.style.overflowY = 'hidden'
    doc.body.style.paddingRight = '16px'

    const restore = () => {
      doc.body.style.overflowY = ''
      doc.body.style.paddingRight = ''
    }

    dialog.addEventListener('close', restore)

    return restore
  }, [open])

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return

    const doc = dialog?.ownerDocument ?? document

    const handleClick = (event: MouseEvent) => {
      const target = event.composedPath?.()[0] ?? event.target
      if (!(target instanceof Element)) return
      if (dialog.contains(target)) return
      dialog.close()
    }

    doc.addEventListener('click', handleClick)

    return () => {
      doc.removeEventListener('click', handleClick)
    }
  }, [])

  return ref
}
