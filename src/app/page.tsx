'use client';

import { Inter } from '@next/font/google';
import styles from './page.module.css';
import { useSession, signIn, signOut } from 'next-auth/react';

const inter = Inter({ subsets: ['latin'] });

export default function Home() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  return (
    <main className={styles.main}>
      {!session && (
        <>
          <span className={styles.notSignedInText}>You are not signed in</span>
          <a
            href={`/api/auth/signin`}
            className={styles.buttonPrimary}
            onClick={(e) => {
              e.preventDefault();
              signIn('keycloak');
            }}
          >
            Sign in
          </a>
        </>
      )}
      {session?.user && (
        <>
          {session.user.image && (
            <span
              style={{ backgroundImage: `url('${session.user.image}')` }}
              className={styles.avatar}
            />
          )}
          <span className={styles.signedInText}>
            <small>Signed in as</small>
            <br />
            <strong>{session.user.email ?? session.user.name}</strong>
            <br />
            <strong>{session.user.id}</strong>
            <br />
            <strong>{session.user.roles}</strong>
          </span>
          <a
            href={`/api/auth/signout`}
            className={styles.button}
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
          >
            Sign out
          </a>
        </>
      )}
    </main>
  );
}
