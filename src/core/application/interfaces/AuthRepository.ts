export interface AuthResponse {
  error: string | null;
  data: any | null;
}

export interface AuthRepository {
  signInWithEmail(email: string, password: string): Promise<AuthResponse>;
  signUpWithEmail(email: string, password: string, name?: string): Promise<AuthResponse>;
  signInWithOAuth(provider: 'google' | 'kakao' | 'naver'): Promise<AuthResponse>;
  signOut(): Promise<void>;
}
