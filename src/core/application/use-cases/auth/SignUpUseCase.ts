import { AuthRepository, AuthResponse } from '../../interfaces/AuthRepository';

export class SignUpUseCase {
  constructor(private authRepository: AuthRepository) {}

  async execute(email: string, password: string, name: string): Promise<AuthResponse> {
    if (!email || !password || !name) {
      return { error: '이메일, 비밀번호, 이름을 모두 입력해주세요.', data: null };
    }
    
    // Add custom validation here if needed
    if (password.length < 6) {
      return { error: '비밀번호는 최소 6자리 이상이어야 합니다.', data: null };
    }

    return await this.authRepository.signUpWithEmail(email, password, name);
  }
}
