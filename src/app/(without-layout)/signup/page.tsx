'use client';

import {FormEvent, useState} from 'react';
import { Input } from '@/widgets/common/Input';
import { Button } from '@/widgets/common/Button';
import { Label } from '@/widgets/common/Label';
import {useSignup} from "@/app/features/auth/hooks/use-signup";

export default function Page() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const { handleSignup } = useSignup();

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSignup(email, password, name, confirmPassword, inviteCode);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md border rounded-xl shadow p-8 space-y-6 bg-white"
      >
        <h1 className="text-2xl font-bold text-center">EnGarde</h1>
        <p className="text-center text-gray-600">Create your account</p>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inviteCode">Invite Code</Label>
            <Input
              id="inviteCode"
              type="text"
              placeholder="Enter your invite code"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              required
            />
          </div>

          <Button className="w-full mt-4" type="submit">
            Sign Up
          </Button>

          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <a href="/login" className="underline underline-offset-4">
              Log in
            </a>
          </div>
        </div>
      </form>
    </main>
  );
}