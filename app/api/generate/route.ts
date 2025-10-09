import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Replicate from 'replicate'
import { randomUUID } from 'crypto'

// Configuration Supabase avec Service Role Key pour accès admin
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Configuration Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    const prompt = formData.get('prompt') as string

    if (!image || !prompt) {
      return NextResponse.json(
        { error: 'Image et prompt requis' },
        { status: 400 }
      )
    }

    console.log('=== Début génération avec Replicate ===')
    console.log('Prompt:', prompt)
    console.log('Image:', image.name, image.size, 'bytes')

    // 1. Upload de l'image d'entrée dans Supabase Storage
    const imageBytes = await image.arrayBuffer()
    const imageBuffer = Buffer.from(imageBytes)
    const inputFileName = `${randomUUID()}-${image.name}`

    console.log('Upload de l\'image input...')
    const { data: inputUploadData, error: inputUploadError } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_INPUT_BUCKET!)
      .upload(inputFileName, imageBuffer, {
        contentType: image.type,
        upsert: false,
      })

    if (inputUploadError) {
      console.error('Erreur upload input:', inputUploadError)
      return NextResponse.json(
        { error: `Erreur lors de l'upload de l'image: ${inputUploadError.message}` },
        { status: 500 }
      )
    }

    console.log('Image input uploadée avec succès:', inputFileName)

    // 2. Récupérer l'URL publique de l'image uploadée
    const { data: inputUrlData } = supabase.storage
      .from(process.env.NEXT_PUBLIC_INPUT_BUCKET!)
      .getPublicUrl(inputFileName)

    const inputImageUrl = inputUrlData.publicUrl
    console.log('URL input:', inputImageUrl)

    // 3. Appeler Replicate avec InstructPix2Pix pour l'édition d'image basée sur instructions
    console.log('Appel à Replicate avec le modèle: timothybrooks/instruct-pix2pix')
    console.log('Token Replicate présent:', !!process.env.REPLICATE_API_TOKEN)
    
    let output: any
    
    try {
      output = await replicate.run(
        "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f" as any,
        {
          input: {
            image: inputImageUrl,
            prompt: prompt,
            num_inference_steps: 20,
            image_guidance_scale: 1.5,
            guidance_scale: 7.5
          }
        }
      )
      
      console.log('Réponse Replicate:', typeof output, output)
    } catch (replicateError: any) {
      console.error('Erreur Replicate détaillée:', replicateError)
      
      if (replicateError.message?.includes('402') || replicateError.message?.includes('Insufficient credit')) {
        return NextResponse.json(
          { error: 'Crédit Replicate insuffisant. Veuillez recharger votre compte sur https://replicate.com/account/billing' },
          { status: 402 }
        )
      }
      
      return NextResponse.json(
        { error: `Erreur Replicate: ${replicateError.message}` },
        { status: 500 }
      )
    }

    // 4. Récupérer l'URL de l'image générée
    let generatedImageUrl: string
    if (Array.isArray(output)) {
      generatedImageUrl = output[0]
    } else if (typeof output === 'string') {
      generatedImageUrl = output
    } else if (output && typeof output === 'object' && output.url) {
      generatedImageUrl = output.url
    } else {
      console.error('Format de sortie Replicate inattendu:', output)
      return NextResponse.json(
        { error: 'Format de réponse Replicate invalide' },
        { status: 500 }
      )
    }

    console.log('URL de l\'image générée par Replicate:', generatedImageUrl)

    // 5. Télécharger l'image générée
    const imageResponse = await fetch(generatedImageUrl)
    if (!imageResponse.ok) {
      throw new Error('Erreur lors du téléchargement de l\'image générée')
    }
    
    const generatedImageBuffer = await imageResponse.arrayBuffer()
    console.log('Image téléchargée, taille:', generatedImageBuffer.byteLength, 'bytes')
    
    const outputFileName = `${randomUUID()}-output.png`

    // 6. Upload de l'image générée dans le bucket output-images
    console.log('Upload de l\'image générée dans Supabase...')
    const { data: outputUploadData, error: outputUploadError } = await supabase.storage
      .from(process.env.NEXT_PUBLIC_OUTPUT_BUCKET!)
      .upload(outputFileName, generatedImageBuffer, {
        contentType: 'image/png',
        upsert: false,
      })

    if (outputUploadError) {
      console.error('Erreur upload output:', outputUploadError)
      return NextResponse.json(
        { error: `Erreur lors de l'upload de l'image générée: ${outputUploadError.message}` },
        { status: 500 }
      )
    }

    console.log('Image output uploadée:', outputFileName)

    // 7. Récupérer l'URL publique de l'image générée
    const { data: outputUrlData } = supabase.storage
      .from(process.env.NEXT_PUBLIC_OUTPUT_BUCKET!)
      .getPublicUrl(outputFileName)

    const outputImageUrl = outputUrlData.publicUrl
    console.log('URL output finale:', outputImageUrl)

    // 8. Sauvegarder dans la table projects (optionnel)
    try {
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .insert({
          input_image_url: inputImageUrl,
          output_image_url: outputImageUrl,
          prompt: prompt,
          status: 'completed',
        })
        .select()

      if (projectError) {
        console.warn('Avertissement sauvegarde project:', projectError.message)
      } else {
        console.log('Projet sauvegardé:', projectData?.[0]?.id)
      }
    } catch (dbError) {
      console.warn('Erreur DB (non bloquante):', dbError)
    }

    console.log('=== Génération terminée avec succès ===')

    // 9. Retourner l'URL de l'image générée
    return NextResponse.json({
      imageUrl: outputImageUrl,
      inputImageUrl: inputImageUrl,
    })

  } catch (error) {
    console.error('=== ERREUR GLOBALE ===')
    console.error('Type:', error?.constructor?.name)
    console.error('Message:', error instanceof Error ? error.message : String(error))
    console.error('Stack:', error instanceof Error ? error.stack : 'N/A')
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Erreur inconnue lors de la génération'
      },
      { status: 500 }
    )
  }
}
