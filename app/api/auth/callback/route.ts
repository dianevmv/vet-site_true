import { NextResponse } from 'next/server'
import { createSupabaseRouteHandlerClient } from '../../../../lib/supabaseServer'

export async function POST(request: Request) {
  const supabase = createSupabaseRouteHandlerClient()
  const { event, session } = await request.json()

  if (event === 'SIGNED_OUT') {
    await supabase.auth.signOut()
    return NextResponse.json({ success: true })
  }

  if (session) {
    await supabase.auth.setSession(session)
  }

  return NextResponse.json({ success: true })
}
