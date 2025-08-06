export const refreshToken = async (headers?: HeadersInit): Promise<boolean> => {

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const response = await fetch(`${baseUrl}/internal-api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    credentials: 'include',
  });

  return response.ok;
};