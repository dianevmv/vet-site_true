import type { ReactNode } from 'react'
import { AuthProvider } from '../context/AuthContext'
import { Header } from '../components/Header'

export const metadata = {
  title: "Éditeur d'Images IA",
  description: "Transformez vos images avec l'intelligence artificielle",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          fontFamily:
            'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: '100vh',
          color: '#0f172a',
        }}
      >
        <AuthProvider>
          <div
            style={{
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Header />
            <main
              style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                padding: '2rem',
              }}
            >
              {children}
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
