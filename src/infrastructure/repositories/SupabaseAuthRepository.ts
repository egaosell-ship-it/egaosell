import { AuthRepository, AuthResponse } from '@/core/application/interfaces/AuthRepository';
import { createClient } from '@/infrastructure/config/supabase/server';
import { redirect } from 'next/navigation';

export class SupabaseAuthRepository implements AuthRepository {
  async signInWithEmail(email: string, password: string): Promise<AuthResponse> {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return {
      data,
      error: error ? error.message : null,
    };
  }

  async signUpWithEmail(email: string, password: string, name?: string): Promise<AuthResponse> {
    const supabase = await createClient();
    
    // Setup url for email verification redirect if needed
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || '',
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    return {
      data,
      error: error ? error.message : null,
    };
  }

  async signInWithOAuth(provider: 'google' | 'kakao' | 'naver'): Promise<AuthResponse> {
    const supabase = await createClient();
    const origin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (data.url) {
      redirect(data.url); // Next.js redirect to provider
    }

    return {
      data,
      error: error ? error.message : null,
    };
  }

  async signOut(): Promise<void> {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
}
