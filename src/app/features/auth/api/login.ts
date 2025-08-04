import {fetcher} from "@/shared/lib/fetcher";
import {BaseResponse} from "@/shared/dto/base-response";
import {LoginResponse} from "@/app/features/auth/dto/login-response";

interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const login = async ({email, password, rememberMe}: LoginRequest) => {
  return await fetcher<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      rememberMe
    })
  })
}