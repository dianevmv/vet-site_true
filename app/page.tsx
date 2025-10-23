import Link from 'next/link'

export default function Home() {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1100px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '3rem',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          color: '#fff',
          display: 'grid',
          gap: '1.75rem',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 0.9rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            fontWeight: 600,
            letterSpacing: '0.04em',
            width: 'fit-content',
          }}
        >
          <span aria-hidden="true">🚀</span>
          Génération IA pour cliniques vétérinaires
        </span>

        <h1
          style={{
            fontSize: '3rem',
            lineHeight: 1.1,
            margin: 0,
            textShadow: '0 10px 40px rgba(15, 23, 42, 0.35)',
          }}
        >
          Donnez vie à vos visuels avec l&apos;IA, sans code ni designer.
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            maxWidth: '540px',
            color: 'rgba(255, 255, 255, 0.82)',
          }}
        >
          IA Vet Studio vous aide à créer en quelques secondes des visuels
          professionnels, adaptés à votre clinique. Téléchargez vos photos, décrivez
          votre idée, laissez l&apos;IA faire le reste.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
          }}
        >
          <Link
            href="/signup"
            style={{
              padding: '0.95rem 1.8rem',
              borderRadius: '12px',
              backgroundColor: '#fff',
              color: '#4c1d95',
              fontWeight: 700,
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 18px 40px rgba(255, 255, 255, 0.25)',
              letterSpacing: '0.02em',
            }}
          >
            Créer mon compte
          </Link>
          <Link
            href="/login"
            style={{
              padding: '0.95rem 1.8rem',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.55)',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              textDecoration: 'none',
              letterSpacing: '0.02em',
            }}
          >
            Se connecter
          </Link>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {[
            {
              title: 'Prêt en 5 minutes',
              description:
                'Connexion Supabase incluse. Gérez vos projets IA en toute simplicité.',
            },
            {
              title: 'Multiples styles',
              description:
                'Transformez vos visuels pour vos réseaux sociaux et vos campagnes.',
            },
            {
              title: 'Sécurité RLS',
              description:
                'Chaque projet reste privé. Protection par policies Supabase.',
            },
          ].map((feature) => (
            <div
              key={feature.title}
              style={{
                backgroundColor: 'rgba(15, 23, 42, 0.22)',
                borderRadius: '14px',
                padding: '1.2rem',
                border: '1px solid rgba(255, 255, 255, 0.16)',
              }}
            >
              <h3
                style={{
                  margin: 0,
                  marginBottom: '0.5rem',
                  fontSize: '1.05rem',
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  color: 'rgba(255, 255, 255, 0.78)',
                  lineHeight: 1.5,
                  fontSize: '0.95rem',
                }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          display: 'grid',
          placeItems: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 'auto',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.45), rgba(255,255,255,0))',
            filter: 'blur(0px)',
            transform: 'translateY(-60px)',
          }}
          aria-hidden="true"
        />
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            borderRadius: '24px',
            padding: '2.5rem',
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 40px 90px rgba(15, 23, 42, 0.55)',
            color: '#fff',
            display: 'grid',
            gap: '1.4rem',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '1.5rem',
              fontWeight: 700,
            }}
          >
            Comment ça marche ?
          </h2>
          <ol
            style={{
              display: 'grid',
              gap: '1rem',
              margin: 0,
              paddingLeft: '1.2rem',
            }}
          >
            <li>
              Importez une photo depuis votre clinique ou vos réseaux sociaux.
            </li>
            <li>
              Décrivez la transformation souhaitée : ambiance, style, texte, etc.
            </li>
            <li>
              Lancez la génération IA et retrouvez vos créations dans votre
              dashboard.
            </li>
          </ol>
          <p
            style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.8)',
              fontSize: '0.95rem',
              lineHeight: 1.5,
            }}
          >
            Une interface simple, pensée pour les équipes vétérinaires qui veulent
            communiquer plus vite, sans sacrifier la qualité.
          </p>
        </div>
      </div>
    </div>
  )
}
