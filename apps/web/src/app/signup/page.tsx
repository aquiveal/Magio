import { redirect } from 'next/navigation';
import { AuthForm } from '@/components/auth-form';
import { getCurrentUser } from '@/lib/auth/session';

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect('/overview');
  return <AuthForm mode="register" />;
}
