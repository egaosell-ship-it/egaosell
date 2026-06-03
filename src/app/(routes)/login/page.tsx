import AuthForm from '@/components/auth/AuthForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background selection:bg-primary/20 selection:text-on-primary-container">
      <AuthForm />
    </div>
  );
}
