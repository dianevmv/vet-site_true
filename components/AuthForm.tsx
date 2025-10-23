'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

type AuthTab = 'login' | 'signup'

interface AuthFormProps {
  initialTab?: AuthTab
}

const MIN_PASSWORD_LENGTH = 6

export function AuthForm({ initialTab = 'login' }: AuthFormProps) {
  const router = useRouter()
  const { signIn, signUp, loading: authLoading, user } = useAuth()

  const [activeTab, setActiveTab] = useState<AuthTab>(initialTab)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab])

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  const tabConfig = useMemo(
    () => ({
      login: {
        title: 'Connexion',
        description: 'Connectez-vous avec votre email Supabase',
        secondaryLink: {
          label: "Pas encore de compte ? Inscrivez-vous",
          href: '/signup',
        },
      },
      signup: {
        title: 'Inscription',
        description: 'Créez un compte pour accéder à vos projets',
        secondaryLink: {
          label: 'Déjà inscrit ? Connectez-vous',
          href: '/login',
        },
      },
    }),
    []
  )

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setFormError('')
    setFormSuccess('')

    if (!email.trim()) {
      setFormError('Veuillez renseigner votre email')
      return
    }

    if (!email.includes('@')) {
      setFormError('Veuillez renseigner un email valide')
      return
    }

    if (!password || password.length < MIN_PASSWORD_LENGTH) {
      setFormError(
        `Le mot de passe doit contenir au moins ${MIN_PASSWORD_LENGTH} caractères`
      )
      return
    }

    if (activeTab === 'signup' && password !== confirmPassword) {
      setFormError('Les mots de passe ne correspondent pas')
      return
    }

    setIsSubmitting(true)

    if (activeTab === 'login') {
      const { error } = await signIn({ email, password })

      if (error) {
        setFormError(error)
      } else {
        router.replace('/dashboard')
      }
    } else {
      const { error, confirmationRequired } = await signUp({
        email,
        password,
      })

      if (error) {
        setFormError(error)
      } else if (confirmationRequired) {
        setFormSuccess(
          'Compte créé ! Consultez vos emails pour confirmer votre adresse.'
        )
      } else {
        router.replace('/dashboard')
      }
    }

    setIsSubmitting(false)
  }

  const handleTabChange = (tab: AuthTab) => {
    if (tab === activeTab) return

    setActiveTab(tab)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
    setFormSuccess('')
  }

  const disabled = isSubmitting || authLoading
  const { title, description, secondaryLink } = tabConfig[activeTab]

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        borderRadius: '18px',
        boxShadow: '0 24px 70px rgba(65, 83, 179, 0.25)',
        padding: '2.5rem',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
          backgroundColor: '#f3f4f6',
          padding: '0.5rem',
          borderRadius: '12px',
        }}
      >
        <button
          onClick={() => handleTabChange('login')}
          type="button"
          style={{
            padding: '0.75rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            background:
              activeTab === 'login'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'transparent',
            color: activeTab === 'login' ? '#fff' : '#6b7280',
            transition: 'all 0.2s ease',
          }}
          disabled={disabled}
        >
          Connexion
        </button>
        <button
          onClick={() => handleTabChange('signup')}
          type="button"
          style={{
            padding: '0.75rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            background:
              activeTab === 'signup'
                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                : 'transparent',
            color: activeTab === 'signup' ? '#fff' : '#6b7280',
            transition: 'all 0.2s ease',
          }}
          disabled={disabled}
        >
          Inscription
        </button>
      </div>

      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2
          style={{
            fontSize: '1.75rem',
            marginBottom: '0.5rem',
            color: '#1f2937',
          }}
        >
          {title}
        </h2>
        <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{description}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span
            style={{
              fontWeight: 600,
              color: '#374151',
              fontSize: '0.95rem',
            }}
          >
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="vous@example.com"
            autoComplete="email"
            required
            disabled={disabled}
            style={{
              padding: '0.9rem',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
        </label>

        <label style={{ display: 'grid', gap: '0.35rem' }}>
          <span
            style={{
              fontWeight: 600,
              color: '#374151',
              fontSize: '0.95rem',
            }}
          >
            Mot de passe
          </span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="••••••••"
            autoComplete={activeTab === 'login' ? 'current-password' : 'new-password'}
            required
            disabled={disabled}
            style={{
              padding: '0.9rem',
              borderRadius: '10px',
              border: '1px solid #d1d5db',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
          />
        </label>

        {activeTab === 'signup' && (
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            <span
              style={{
                fontWeight: 600,
                color: '#374151',
                fontSize: '0.95rem',
              }}
            >
              Confirmez le mot de passe
            </span>
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              required
              disabled={disabled}
              style={{
                padding: '0.9rem',
                borderRadius: '10px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                fontFamily: 'inherit',
              }}
            />
          </label>
        )}

        {formError && (
          <div
            style={{
              backgroundColor: '#fee2e2',
              borderRadius: '10px',
              padding: '0.85rem',
              color: '#b91c1c',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            {formError}
          </div>
        )}

        {formSuccess && (
          <div
            style={{
              backgroundColor: '#dcfce7',
              borderRadius: '10px',
              padding: '0.85rem',
              color: '#15803d',
              fontSize: '0.9rem',
              fontWeight: 500,
            }}
          >
            {formSuccess}
          </div>
        )}

        <button
          type="submit"
          disabled={disabled}
          style={{
            marginTop: '0.5rem',
            padding: '0.9rem',
            borderRadius: '10px',
            border: 'none',
            fontWeight: 600,
            fontSize: '1.05rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            background: disabled
              ? '#c7d2fe'
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: disabled
              ? 'none'
              : '0 12px 30px rgba(102, 126, 234, 0.35)',
          }}
        >
          {activeTab === 'login'
            ? isSubmitting
              ? 'Connexion en cours...'
              : 'Se connecter'
            : isSubmitting
            ? 'Création du compte...'
            : "S'inscrire"}
        </button>
      </form>

      <p
        style={{
          marginTop: '1.5rem',
          textAlign: 'center',
          fontSize: '0.95rem',
          color: '#6b7280',
        }}
      >
        {secondaryLink.label}{' '}
        <Link
          href={secondaryLink.href}
          style={{
            color: '#4c1d95',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ici
        </Link>
        .
      </p>
    </div>
  )
}
