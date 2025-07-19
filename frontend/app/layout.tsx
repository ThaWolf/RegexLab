import './globals.css'
import type { ReactNode } from 'react'
import Providers from './providers'
import Navbar from '../components/Navbar'
import ErrorBoundary from '../components/ErrorBoundary'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-background-light text-text-primary-light dark:bg-background-dark dark:text-text-primary-dark transition-colors duration-300 antialiased">
        <Providers>
          <ErrorBoundary>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
              {children}
            </main>
          </ErrorBoundary>
        </Providers>
      </body>
    </html>
  )
}
