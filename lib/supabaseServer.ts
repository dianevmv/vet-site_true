import { cookies } from 'next/headers'
import type { NextRequest, NextResponse } from 'next/server'
import {
  createMiddlewareClient,
  createRouteHandlerClient,
  createServerComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

export const createSupabaseServerClient = () =>
  createServerComponentClient<Database>({ cookies })

export const createSupabaseRouteHandlerClient = () =>
  createRouteHandlerClient<Database>({ cookies })

export const createSupabaseMiddlewareClient = (
  req: NextRequest,
  res: NextResponse
) => createMiddlewareClient<Database>({ req, res })

export const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables for admin client')
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
    },
  })
}
