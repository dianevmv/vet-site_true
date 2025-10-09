export const metadata = {
  title: "Éditeur d'Images IA",
  description: "Transformez vos images avec l'intelligence artificielle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body style={{ 
        margin: 0, 
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        minHeight: '100vh'
      }}>
        {children}
      </body>
    </html>
  );
}
