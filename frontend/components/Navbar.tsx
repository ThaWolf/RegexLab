'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Navbar() {
  const { data: session } = useSession()

  return (
    <nav className="flex items-center justify-between bg-white p-4 shadow">
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
