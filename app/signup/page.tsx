import { AuthForm } from '../../components/AuthForm'

export default function SignupPage() {
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AuthForm initialTab="signup" />
    </div>
  )
}
