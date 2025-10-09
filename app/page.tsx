'use client'

import { useState, FormEvent } from 'react'

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [prompt, setPrompt] = useState<string>('')
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [loadingMessage, setLoadingMessage] = useState<string>('')
  const [error, setError] = useState<string>('')

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError('')
      setGeneratedImageUrl('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    if (!selectedImage) {
      setError('Veuillez sélectionner une image')
      return
    }
    
    if (!prompt.trim()) {
      setError('Veuillez entrer un prompt de transformation')
      return
    }

    setIsLoading(true)
    setError('')
    setLoadingMessage('Upload de l\'image...')

    const formData = new FormData()
    formData.append('image', selectedImage)
    formData.append('prompt', prompt)

    try {
      setLoadingMessage('Génération en cours avec l\'IA...')
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la génération')
      }

      setGeneratedImageUrl(data.imageUrl)
      setLoadingMessage('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setLoadingMessage('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        maxWidth: '900px',
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '0.5rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          ✨ Éditeur d'Images IA
        </h1>
        
        <p style={{
          textAlign: 'center',
          color: '#666',
          marginBottom: '2rem',
          fontSize: '1.1rem'
        }}>
          Transformez vos images avec l'intelligence artificielle
        </p>

        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#333',
              fontSize: '1rem'
            }}>
              📷 Image à transformer
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '1rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            />
          </div>

          {previewUrl && (
            <div style={{
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              <img
                src={previewUrl}
                alt="Aperçu"
                style={{
                  maxWidth: '100%',
                  maxHeight: '300px',
                  borderRadius: '10px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}
              />
            </div>
          )}

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block',
              marginBottom: '0.5rem',
              fontWeight: '600',
              color: '#333',
              fontSize: '1rem'
            }}>
              ✍️ Prompt de transformation
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              placeholder="Ex: Transforme cette image en style cartoon, ajoute des couleurs vibrantes..."
              rows={4}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e0e0e0',
                borderRadius: '10px',
                fontSize: '1rem',
                resize: 'vertical',
                fontFamily: 'inherit',
                opacity: isLoading ? 0.6 : 1
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedImage || !prompt.trim()}
            style={{
              width: '100%',
              padding: '1rem',
              background: isLoading || !selectedImage || !prompt.trim() 
                ? '#ccc' 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: isLoading || !selectedImage || !prompt.trim() ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
            }}
            onMouseOver={(e) => {
              if (!isLoading && selectedImage && prompt.trim()) {
                e.currentTarget.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {isLoading ? '⏳ Génération en cours...' : '🚀 Générer'}
          </button>
        </form>

        {loadingMessage && (
          <div style={{
            padding: '1rem',
            background: '#e3f2fd',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#1976d2',
            fontWeight: '500'
          }}>
            {loadingMessage}
          </div>
        )}

        {error && (
          <div style={{
            padding: '1rem',
            background: '#ffebee',
            borderRadius: '10px',
            textAlign: 'center',
            marginBottom: '1rem',
            color: '#c62828',
            fontWeight: '500'
          }}>
            ❌ {error}
          </div>
        )}

        {generatedImageUrl && (
          <div style={{
            marginTop: '2rem',
            padding: '1.5rem',
            background: '#f5f5f5',
            borderRadius: '15px'
          }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#333',
              textAlign: 'center'
            }}>
              ✅ Image générée
            </h2>
            <img
              src={generatedImageUrl}
              alt="Image générée"
              style={{
                width: '100%',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
            />
            <a
              href={generatedImageUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'block',
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#4caf50',
                color: 'white',
                textAlign: 'center',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.background = '#45a049'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.background = '#4caf50'
              }}
            >
              📥 Télécharger l'image
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
