import '@/styles/globals.css'
import { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Synth App',
  description: 'A collection of beautiful synthwave images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={inter.className}>
      <head />
      <body>{children}</body>
    </html>
  )
}
