export async function refreshToken(req?: Request): Promise<boolean> {
  const isServer = typeof window === 'undefined';

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      ...(isServer && req
        ? { cookie: req.headers.get('cookie') || '' }
        : {}),
    },
    credentials: 'include',
  });

  return res.ok;
}