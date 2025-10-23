'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Session, SupabaseClient, User } from '@supabase/supabase-js'
import { createSupabaseClient } from '../lib/supabaseClient'
import type { Database } from '../types/database'

interface Credentials {
  email: string
  password: string
}

interface AuthContextValue {
  supabase: SupabaseClient<Database>
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (credentials: Credentials) => Promise<{ error?: string }>
  signUp: (
    credentials: Credentials
  ) => Promise<{ error?: string; confirmationRequired?: boolean }>
  signOut: () => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = useMemo(() => createSupabaseClient(), [])
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) {
        return
      }

      setSession(newSession)
      setUser(newSession?.user ?? null)
      setLoading(false)

      const authEventsNeedingSync = [
        'SIGNED_IN',
        'SIGNED_OUT',
        'TOKEN_REFRESHED',
        'USER_UPDATED',
      ]

      if (authEventsNeedingSync.includes(event)) {
        try {
          await fetch('/api/auth/callback', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ event, session: newSession }),
          })
        } catch (error) {
          console.error('Failed to sync auth cookie', error)
        } finally {
          router.refresh()
        }
      }
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = useCallback<
    AuthContextValue['signIn']
  >(async ({ email, password }) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return {}
  }, [supabase])

  const signUp = useCallback<
    AuthContextValue['signUp']
  >(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return { error: error.message }
    }

    return {
      confirmationRequired: !data.session,
    }
  }, [supabase])

  const signOut = useCallback<AuthContextValue['signOut']>(async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { error: error.message }
    }

    return {}
  }, [supabase])

  const value = useMemo(
    () => ({
      supabase,
      user,
      session,
      loading,
      signIn,
      signUp,
      signOut,
    }),
    [supabase, user, session, loading, signIn, signUp, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
