import './globals.css'
import type { ReactNode } from 'react'
import Providers from './providers'
import Navbar from '../components/Navbar'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-100">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
