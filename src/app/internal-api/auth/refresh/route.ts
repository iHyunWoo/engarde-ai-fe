import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const header = await headers();
  const cookie = header.get('cookie') ?? '';

  const backendRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      cookie,
      'Content-Type': 'application/json',
    },
  });

  const text = await backendRes.text();
  const res = new NextResponse(text, {
    status: backendRes.status,
  });

  const setCookie = backendRes.headers.get('set-cookie');
  if (setCookie) {
    res.headers.set('set-cookie', setCookie);
  }

  return res;
}