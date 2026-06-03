'use server';

import { SupabaseAuthRepository } from '@/infrastructure/repositories/SupabaseAuthRepository';
import { LoginUseCase } from '@/core/application/use-cases/auth/LoginUseCase';
import { SignUpUseCase } from '@/core/application/use-cases/auth/SignUpUseCase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const authRepository = new SupabaseAuthRepository();
const loginUseCase = new LoginUseCase(authRepository);
const signUpUseCase = new SignUpUseCase(authRepository);

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const result = await loginUseCase.execute(email, password);

  if (result.error) {
    return { error: result.error };
  }

  revalidatePath('/');
  redirect('/');
}

export async function signUpAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const result = await signUpUseCase.execute(email, password, name);

  if (result.error) {
    return { error: result.error };
  }

  // Supabase defaults to requiring email confirmation. 
  // If so, we might not want to redirect immediately to '/' if not logged in.
  // We can return a success message or redirect to a "check your email" page.
  // For now, let's redirect to home if successful (assuming auto confirm or login).
  revalidatePath('/');
  redirect('/');
}

export async function oAuthLoginAction(provider: 'google' | 'kakao' | 'naver') {
  const result = await loginUseCase.executeOAuth(provider);
  if (result.error) {
    return { error: result.error };
  }
}

export async function logoutAction() {
  await authRepository.signOut();
  revalidatePath('/');
  redirect('/login');
}
