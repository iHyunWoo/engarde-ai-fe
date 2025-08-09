import { NextRequest, NextResponse } from 'next/server';
import { ResponseCookies } from 'next/dist/compiled/@edge-runtime/cookies';
import { RequestCookies } from 'next/dist/compiled/@edge-runtime/cookies';

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get('refresh_token')?.value;

  // 토큰이 없으면 바로 패스
  if (!refreshToken) {
    return NextResponse.next();
  }

  // access_token이 만료된 경우에만 refresh 시도
  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      cookie: req.headers.get('cookie') ?? '',
      'Content-Type': 'application/json',
    },
  });

  const res = NextResponse.next();

  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
    applySetCookie(req, res);
  }

  return res;
}

export function applySetCookie(req: NextRequest, res: NextResponse): void {
  const setCookies = new ResponseCookies(res.headers);
  const newReqHeaders = new Headers(req.headers);
  const newReqCookies = new RequestCookies(newReqHeaders);

  setCookies.getAll().forEach((cookie) => {
    newReqCookies.set(cookie);
  });

  const overrideRes = NextResponse.next({
    request: {
      headers: newReqHeaders,
    },
  });

  overrideRes.headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value);
    }
  });
}

export const config = {
  matcher: [
    '/matches/:id',
  ],
};