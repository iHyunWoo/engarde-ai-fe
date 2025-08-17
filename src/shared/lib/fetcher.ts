import {refreshToken} from "@/shared/lib/refresh-token";
import {BaseResponse} from "@/shared/dto/base-response";
import {useUserStore} from "@/shared/hooks/use-user-store";

interface FetcherOptions {
  req?: Request;
  headers?: HeadersInit;
  retry?: boolean;
};

export async function fetcher<T>(
  input: RequestInfo | URL,
  init: RequestInit = {},
  options: FetcherOptions = {}
): Promise<BaseResponse<T> | null> {
  const { req, headers = {}, retry = false } = options;

  const url = typeof input === 'string' ? input : input;

  const finalHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    ...headers,
  };

  const response = await fetch(url, {
    ...init,
    headers: finalHeaders,
    credentials: 'include',
  });

  // 액세스 토큰 만료 → refresh 요청 → 재시도
  if (response.status === 401 && !retry) {
    try {
      const body: BaseResponse = await response.clone().json();

      if (body.message === 'TOKEN_EXPIRED') {
        const refreshSuccess = await refreshToken(req);
        if (refreshSuccess) {
          return fetcher<T>(input, init, {
            ...options,
            retry: true,
          });
        }
      }

      // 로그아웃 처리
      const userStore = useUserStore.getState();
      userStore.cleanUser();
      window.location.href = '/login';
      return null;
    } catch {
      return null;
    }
  }

  try {
    const body: BaseResponse<T> = await response.json();
    return body;
  } catch {
    return null;
  }
}