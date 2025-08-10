'use client';

import {FormEvent, useState} from 'react';
import { Input } from '@/widgets/common/Input';
import { Button } from '@/widgets/common/Button';
import { Checkbox } from '@/widgets/common/Checkbox';
import { Label } from '@/widgets/common/Label';
import {useLogin} from "@/app/features/auth/hooks/use-login";

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const { handleLogin } = useLogin();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleLogin(email, password, rememberMe);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border rounded-xl shadow p-8 space-y-6 bg-white"
      >
        <h1 className="text-2xl font-bold text-center">EnGarde</h1>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder=""
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
            />
            <Label htmlFor="remember">Remember me</Label>
          </div>

          <Button className="w-full mt-4" type="submit">
            Log In
          </Button>

          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="underline underline-offset-4">
              Sign up
            </a>
          </div>
        </div>
      </form>
    </main>
  );
}