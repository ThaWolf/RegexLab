'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useTheme } from '../app/providers'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <button
      aria-label="Toggle theme"
      className="ml-4 p-2 rounded transition-colors hover:bg-garden-light dark:hover:bg-garden-dark"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? (
        <span role="img" aria-label="Light mode">🌞</span>
      ) : (
        <span role="img" aria-label="Dark mode">🌙</span>
      )}
    </button>
  )
}

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex items-center justify-between bg-white dark:bg-garden-dark p-4 shadow">
      <div className="font-bold">
        <Link href="/">RegexLab</Link>
      </div>
      <div className="flex items-center gap-4">
        <Link href="/train" className="underline">
          Train
        </Link>
        <Link href="/docs" className="underline">
          Docs
        </Link>
        <ThemeToggle />
        {session ? (
          <div className="flex items-center gap-2">
            {session.user?.image && (
              <Image
                src={session.user.image}
                alt={session.user.name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            )}
            <span>{session.user?.name}</span>
            <button onClick={() => signOut()} className="ml-2 underline">
              Sign out
            </button>
          </div>
        ) : (
          <button onClick={() => signIn('google')} className="underline">
            Sign in
          </button>
        )}
      </div>
    </nav>
  )
}
