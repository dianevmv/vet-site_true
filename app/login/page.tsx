import { AuthForm } from '../../components/AuthForm'

export default function LoginPage() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AuthForm initialTab="login" />
    </div>
  )
}
