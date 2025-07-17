import './globals.css'
import type { ReactNode } from 'react'
import Providers from './providers'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-earth-light text-garden-dark dark:bg-garden-dark dark:text-earth-light transition-colors">
        <Providers>
          <Navbar />
          <main className="max-w-5xl mx-auto px-4 py-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
