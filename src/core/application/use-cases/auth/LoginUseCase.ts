import { AuthRepository, AuthResponse } from '../../interfaces/AuthRepository';

export class LoginUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string): Promise<AuthResponse> {
    if (!email || !password) {
      return { error: '이메일과 비밀번호를 입력해주세요.', data: null };
    }
    return await this.authRepository.signInWithEmail(email, password);
  }

  async executeOAuth(provider: 'google' | 'kakao' | 'naver'): Promise<AuthResponse> {
    return await this.authRepository.signInWithOAuth(provider);
  }
}
