'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Radar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type Mode = 'login' | 'register';

const COPY: Record<Mode, { title: string; description: string; cta: string; endpoint: string; altText: string; altLink: string; altHref: string }> = {
  login: {
    title: 'Welcome back',
    description: 'Sign in to your Magio dashboard.',
    cta: 'Sign in',
    endpoint: '/api/auth/login',
    altText: "Don't have an account?",
    altLink: 'Create one',
    altHref: '/signup',
  },
  register: {
    title: 'Create your account',
    description: 'Set up Magio to start tracking email opens.',
    cta: 'Create account',
    endpoint: '/api/auth/register',
    altText: 'Already have an account?',
    altLink: 'Sign in',
    altHref: '/login',
  },
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const copy = COPY[mode];
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(copy.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }
      router.replace('/overview');
      router.refresh();
    } catch {
      setError('Network error — is the server reachable?');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center justify-center gap-2.5 mb-6">
          <div className="bg-primary/20 p-1.5 rounded-lg">
            <Radar className="w-5 h-5 text-primary" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Magio</span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{copy.title}</CardTitle>
            <CardDescription>{copy.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-3">
              <div className="space-y-1">
                <label htmlFor="username" className="text-xs font-medium text-muted-foreground">Username</label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-medium text-muted-foreground">Password</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  required
                />
              </div>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? 'Please wait…' : copy.cta}
              </Button>
            </form>

            <p className="mt-4 text-center text-xs text-muted-foreground">
              {copy.altText}{' '}
              <Link href={copy.altHref} className="text-primary hover:underline font-medium">
                {copy.altLink}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
