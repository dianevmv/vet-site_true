'use client'

import Link from 'next/link'
import { useAuth } from '../context/AuthContext'

export function Header() {
  const { user, signOut, loading } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <header
      style={{
        width: '100%',
        padding: '1.25rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        background: 'rgba(255, 255, 255, 0.12)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
        backdropFilter: 'blur(16px)',
      }}
    >
      <Link
        href="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#fff',
          fontWeight: 700,
          textDecoration: 'none',
          fontSize: '1.1rem',
          letterSpacing: '0.02em',
        }}
      >
        <span style={{ fontSize: '1.4rem' }}>✨</span>
        IA Vet Studio
      </Link>

      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#fff',
          fontSize: '0.95rem',
        }}
      >
        {loading ? (
          <span>Chargement...</span>
        ) : user ? (
          <>
            <span
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
              }}
            >
              {user.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                color: '#4c1d95',
                background: '#fff',
                boxShadow: '0 10px 30px rgba(76, 29, 149, 0.25)',
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.4)',
                textDecoration: 'none',
                color: '#fff',
                fontWeight: 600,
              }}
            >
              Connexion
            </Link>
            <Link
              href="/signup"
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '10px',
                border: 'none',
                textDecoration: 'none',
                color: '#4c1d95',
                fontWeight: 600,
                background: '#fff',
                boxShadow: '0 10px 30px rgba(76, 29, 149, 0.25)',
              }}
            >
              Inscription
            </Link>
          </>
        )}
      </nav>
    </header>
  )
}
