import { NextRequest, NextResponse } from 'next/server'
import {
  createSupabaseAdminClient,
  createSupabaseRouteHandlerClient,
} from '../../../lib/supabaseServer'

function extractStoragePath(publicUrl: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`
  const index = publicUrl.indexOf(marker)
  if (index === -1) return null
  return publicUrl.slice(index + marker.length)
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteHandlerClient()
    const adminClient = createSupabaseAdminClient()

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session?.user) {
      return NextResponse.json(
        { error: 'Authentification requise' },
        { status: 401 }
      )
    }

    const inputBucket = process.env.NEXT_PUBLIC_INPUT_BUCKET
    const outputBucket = process.env.NEXT_PUBLIC_OUTPUT_BUCKET

    if (!inputBucket || !outputBucket) {
      return NextResponse.json(
        { error: 'Buckets Supabase non configurés' },
        { status: 500 }
      )
    }

    const { projectId } = await request.json()

    if (!projectId) {
      return NextResponse.json(
        { error: 'Identifiant du projet requis' },
        { status: 400 }
      )
    }

    const { data: project, error: fetchError } = await supabase
      .from('projects')
      .select('id, input_image_url, output_image_url')
      .eq('id', projectId)
      .single()

    if (fetchError) {
      return NextResponse.json(
        { error: `Projet introuvable: ${fetchError.message}` },
        { status: 404 }
      )
    }

    const objectsToRemove: { bucket: string; path: string }[] = []

    if (project.input_image_url) {
      const path = extractStoragePath(project.input_image_url, inputBucket)
      if (path) {
        objectsToRemove.push({ bucket: inputBucket, path })
      }
    }

    if (project.output_image_url) {
      const path = extractStoragePath(project.output_image_url, outputBucket)
      if (path) {
        objectsToRemove.push({ bucket: outputBucket, path })
      }
    }

    if (objectsToRemove.length) {
      const removalResults = await Promise.all(
        objectsToRemove.map(({ bucket, path }) =>
          adminClient.storage.from(bucket).remove([path])
        )
      )

      const removalError = removalResults.find((result) => result.error)
      if (removalError?.error) {
        return NextResponse.json(
          {
            error: `Erreur lors de la suppression des fichiers: ${removalError.error.message}`,
          },
          { status: 500 }
        )
      }
    }

    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId)

    if (deleteError) {
      return NextResponse.json(
        { error: `Erreur lors de la suppression du projet: ${deleteError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur API delete:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur inconnue lors de la suppression',
      },
      { status: 500 }
    )
  }
}
