'use client'

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import type { Database } from '../../types/database'

type Project = Database['public']['Tables']['projects']['Row']

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, supabase } = useAuth()

  const [projects, setProjects] = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [formError, setFormError] = useState('')
  const [formSuccess, setFormSuccess] = useState('')
  const [prompt, setPrompt] = useState('')
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')

  useEffect(() => {
    if (authLoading) {
      return
    }

    if (!user) {
      router.replace('/login')
      return
    }

    const fetchProjects = async () => {
      setProjectsLoading(true)
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erreur chargement projets', error)
        setFormError(
          "Impossible de charger vos projets pour le moment. Réessayez plus tard."
        )
      } else {
        setProjects(data ?? [])
      }

      setProjectsLoading(false)
    }

    fetchProjects()
  }, [authLoading, supabase, user, router])

  const isSubmitDisabled = useMemo(() => {
    return (
      !selectedImage ||
      !prompt.trim() ||
      isGenerating ||
      loadingMessage.length > 0
    )
  }, [selectedImage, prompt, isGenerating, loadingMessage])

  const resetForm = () => {
    setPrompt('')
    setSelectedImage(null)
    setPreviewUrl(null)
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedImage(file)
    const reader = new FileReader()

    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }

    reader.readAsDataURL(file)
    setFormError('')
    setFormSuccess('')
  }

  const handleGenerate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedImage) {
      setFormError('Veuillez sélectionner une image')
      return
    }

    if (!prompt.trim()) {
      setFormError('Veuillez saisir un prompt de transformation')
      return
    }

    setFormError('')
    setFormSuccess('')
    setIsGenerating(true)
    setLoadingMessage("Upload de l'image en cours...")

    const formData = new FormData()
    formData.append('image', selectedImage)
    formData.append('prompt', prompt)

    try {
      setLoadingMessage('Génération de votre image avec IA Vet Studio...')
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Erreur lors de la génération')
      }

      const newProject: Project | undefined = payload.project

      if (newProject) {
        setProjects((current) => [newProject, ...current])
      }

      setFormSuccess('Image générée avec succès !')
      resetForm()
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la génération'
      )
    } finally {
      setIsGenerating(false)
      setLoadingMessage('')
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch('/api/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId }),
      })

      const payload = await response.json()

      if (!response.ok) {
        throw new Error(payload.error || 'Suppression impossible')
      }

      setProjects((current) => current.filter((project) => project.id !== projectId))
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors de la suppression'
      )
    }
  }

  if (authLoading || !user) {
    return (
      <div
        style={{
          color: '#fff',
          fontSize: '1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
        }}
      >
        Chargement de votre espace...
      </div>
    )
  }

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1100px',
        display: 'grid',
        gap: '2.5rem',
        paddingBottom: '4rem',
      }}
    >
      <section
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.92)',
          borderRadius: '20px',
          padding: '2.5rem',
          boxShadow: '0 24px 70px rgba(15, 23, 42, 0.25)',
          display: 'grid',
          gap: '1.5rem',
        }}
      >
        <header
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '2rem',
              color: '#1f2937',
            }}
          >
            Créer une nouvelle transformation
          </h1>
          <p style={{ margin: 0, color: '#6b7280' }}>
            Téléchargez une image de votre clinique et décrivez le rendu souhaité. Votre
            projet sera enregistré automatiquement.
          </p>
        </header>

        <form
          onSubmit={handleGenerate}
          style={{
            display: 'grid',
            gap: '1.2rem',
          }}
        >
          <label
            style={{
              display: 'grid',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Image de départ
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isGenerating}
              style={{
                border: '1px dashed #c7d2fe',
                padding: '1rem',
                borderRadius: '14px',
                backgroundColor: '#f8fafc',
              }}
            />
          </label>

          {previewUrl && (
            <div
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start',
              }}
            >
              <Image
                src={previewUrl}
                alt="Prévisualisation"
                width={180}
                height={180}
                style={{
                  borderRadius: '12px',
                  objectFit: 'cover',
                  border: '1px solid #e5e7eb',
                }}
              />
              <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                Assurez-vous d&apos;avoir les droits sur cette image. Formats acceptés :
                PNG, JPG, WEBP (max 5 Mo).
              </div>
            </div>
          )}

          <label
            style={{
              display: 'grid',
              gap: '0.5rem',
            }}
          >
            <span
              style={{
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Prompt de transformation
            </span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ex. : Mettre en avant la salle d'attente avec un style lumineux, ajouter un chien heureux et du texte 'Consultations 7J/7'"
              rows={4}
              disabled={isGenerating}
              style={{
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </label>

          {loadingMessage && (
            <div
              style={{
                padding: '0.9rem',
                borderRadius: '12px',
                backgroundColor: '#e0f2fe',
                color: '#0c4a6e',
                fontWeight: 500,
              }}
            >
              {loadingMessage}
            </div>
          )}

          {formError && (
            <div
              style={{
                padding: '0.9rem',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                fontWeight: 500,
              }}
            >
              {formError}
            </div>
          )}

          {formSuccess && (
            <div
              style={{
                padding: '0.9rem',
                borderRadius: '12px',
                backgroundColor: '#dcfce7',
                color: '#166534',
                fontWeight: 500,
              }}
            >
              {formSuccess}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitDisabled}
            style={{
              padding: '1rem',
              borderRadius: '12px',
              border: 'none',
              fontSize: '1.05rem',
              fontWeight: 600,
              color: '#fff',
              cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
              background: isSubmitDisabled
                ? '#c7d2fe'
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: isSubmitDisabled
                ? 'none'
                : '0 18px 40px rgba(102, 126, 234, 0.35)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            {isGenerating ? 'Génération en cours...' : 'Lancer la génération'}
          </button>
        </form>
      </section>

      <section
        style={{
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          borderRadius: '20px',
          padding: '2.5rem',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          color: '#fff',
          display: 'grid',
          gap: '1.5rem',
        }}
      >
        <header>
          <h2
            style={{
              margin: 0,
              fontSize: '1.75rem',
            }}
          >
            Mes projets
          </h2>
          <p
            style={{
              margin: '0.5rem 0 0',
              color: 'rgba(255, 255, 255, 0.75)',
            }}
          >
            Retrouvez ici toutes vos transformations IA. Téléchargez-les ou supprimez-les
            en un clic.
          </p>
        </header>

        {projectsLoading ? (
          <div>Chargement de vos projets...</div>
        ) : projects.length === 0 ? (
          <div
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '14px',
              padding: '1.5rem',
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.7)',
            }}
          >
            Vous n&apos;avez pas encore de projet. Lancez une génération pour commencer !
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gap: '1.5rem',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            }}
          >
            {projects.map((project) => (
              <article
                key={project.id}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '14px',
                  padding: '1rem',
                  display: 'grid',
                  gap: '1rem',
                }}
              >
                {project.output_image_url ? (
                  <Image
                    src={project.output_image_url}
                    alt="Image générée"
                    width={320}
                    height={320}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '12px',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      paddingTop: '56%',
                      borderRadius: '12px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    }}
                  />
                )}
                <div
                  style={{
                    display: 'grid',
                    gap: '0.75rem',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      color: 'rgba(255, 255, 255, 0.75)',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                    }}
                  >
                    {project.prompt}
                  </p>
                  <div
                    style={{
                      display: 'grid',
                      gap: '0.5rem',
                    }}
                  >
                    {project.output_image_url && (
                      <a
                        href={project.output_image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '10px',
                          textDecoration: 'none',
                          color: '#0f172a',
                          backgroundColor: '#fff',
                          fontWeight: 600,
                        }}
                      >
                        Télécharger
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteProject(project.id)}
                      style={{
                        padding: '0.6rem 0.8rem',
                        borderRadius: '10px',
                        border: '1px solid rgba(248, 113, 113, 0.4)',
                        backgroundColor: 'transparent',
                        color: '#fecaca',
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
