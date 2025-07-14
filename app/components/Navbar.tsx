'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
      <Link href="/">Home</Link>
      <Link href="/dashboard">Dashboard</Link>
      {session ? (
        <>
          {session.user?.image && (
            <Image src={session.user.image} alt="avatar" width={32} height={32} />
          )}
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()}>Sign out</button>
        </>
      ) : (
        <button onClick={() => signIn('google')}>Sign in</button>
      )}
    </nav>
  );
}
