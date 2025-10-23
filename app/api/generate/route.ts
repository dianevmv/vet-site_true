import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { randomUUID } from 'crypto'
import {
  createSupabaseAdminClient,
  createSupabaseRouteHandlerClient,
} from '../../../lib/supabaseServer'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseRouteHandlerClient()
    const adminClient = createSupabaseAdminClient()

    if (!process.env.REPLICATE_API_TOKEN) {
      return NextResponse.json(
        { error: 'REPLICATE_API_TOKEN manquant dans la configuration' },
        { status: 500 }
      )
    }

    const replicate = new Replicate({
      auth: process.env.REPLICATE_API_TOKEN!,
    })

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

    const userId = session.user.id

    const inputBucket = process.env.NEXT_PUBLIC_INPUT_BUCKET
    const outputBucket = process.env.NEXT_PUBLIC_OUTPUT_BUCKET

    if (!inputBucket || !outputBucket) {
      return NextResponse.json(
        { error: 'Buckets Supabase non configurés' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const image = formData.get('image') as File | null
    const prompt = formData.get('prompt') as string | null

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image et prompt requis' },
        { status: 400 }
      )
    }

    const imageBytes = await image.arrayBuffer()
    const imageBuffer = Buffer.from(imageBytes)
    const inputFileName = `${userId}/${randomUUID()}-${image.name}`

    const { error: inputUploadError } = await adminClient.storage
      .from(inputBucket)
      .upload(inputFileName, imageBuffer, {
        contentType: image.type,
        upsert: false,
      })

    if (inputUploadError) {
      return NextResponse.json(
        {
          error: `Erreur lors de l'upload de l'image: ${inputUploadError.message}`,
        },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl: inputImageUrl },
    } = adminClient.storage.from(inputBucket).getPublicUrl(inputFileName)

    let output
    try {
      output = await replicate.run(
        'timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f' as any,
        {
          input: {
            image: inputImageUrl,
            prompt,
            num_inference_steps: 20,
            image_guidance_scale: 1.5,
            guidance_scale: 7.5,
          },
        }
      )
    } catch (replicateError: any) {
      if (
        replicateError?.message?.includes('402') ||
        replicateError?.message?.includes('Insufficient credit')
      ) {
        return NextResponse.json(
          {
            error:
              'Crédit Replicate insuffisant. Veuillez recharger votre compte sur https://replicate.com/account/billing',
          },
          { status: 402 }
        )
      }

      return NextResponse.json(
        { error: `Erreur Replicate: ${replicateError.message}` },
        { status: 500 }
      )
    }

    let generatedImageUrl: string | null = null

    if (Array.isArray(output) && output.length) {
      generatedImageUrl = output[0]
    } else if (typeof output === 'string') {
      generatedImageUrl = output
    } else if (output && typeof output === 'object' && 'url' in output) {
      generatedImageUrl = (output as { url: string }).url
    }

    if (!generatedImageUrl) {
      return NextResponse.json(
        { error: 'Format de réponse Replicate invalide' },
        { status: 500 }
      )
    }

    const imageResponse = await fetch(generatedImageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json(
        { error: "Erreur lors du téléchargement de l'image générée" },
        { status: 500 }
      )
    }

    const generatedImageBuffer = await imageResponse.arrayBuffer()
    const outputFileName = `${userId}/${randomUUID()}-output.png`

    const { error: outputUploadError } = await adminClient.storage
      .from(outputBucket)
      .upload(outputFileName, generatedImageBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (outputUploadError) {
      return NextResponse.json(
        {
          error: `Erreur lors de l'upload de l'image générée: ${outputUploadError.message}`,
        },
        { status: 500 }
      )
    }

    const {
      data: { publicUrl: outputImageUrl },
    } = adminClient.storage.from(outputBucket).getPublicUrl(outputFileName)

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: userId,
        input_image_url: inputImageUrl,
        output_image_url: outputImageUrl,
        prompt,
        status: 'completed',
      })
      .select()
      .single()

    if (projectError) {
      return NextResponse.json(
        { error: `Erreur lors de l'enregistrement du projet: ${projectError.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      project,
    })
  } catch (error) {
    console.error('Erreur API generate:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Erreur inconnue lors de la génération',
      },
      { status: 500 }
    )
  }
}
