'use client';

import { lusitana } from '@/app/ui/fonts';
import {
  AtSymbolIcon,
  KeyIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { Button } from '@/app/ui/button';
import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { useSearchParams } from 'next/navigation';

export default function LoginFormGoldWhite() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="flex-1 rounded-lg bg-white shadow-xl px-6 pb-6 pt-8 border border-yellow-300">
        <h1 className={`${lusitana.className} mb-4 text-2xl font-bold text-center text-yellow-600`}>
          Admin Inventory Login
        </h1>
        <p className="mb-6 text-sm text-center text-gray-500">
          Please log in with your admin credentials.
        </p>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-yellow-300 py-2 pl-10 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
              id="email"
              type="email"
              name="email"
              placeholder="Enter admin email"
              required
            />
            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500 peer-focus:text-yellow-600" />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
          <div className="relative">
            <input
              className="peer block w-full rounded-md border border-yellow-300 py-2 pl-10 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-yellow-500"
              id="password"
              type="password"
              name="password"
              placeholder="Enter admin password"
              required
              minLength={6}
            />
            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-yellow-500 peer-focus:text-yellow-600" />
          </div>
        </div>

        <input type="hidden" name="redirectTo" value={callbackUrl} />

        <Button className="mt-6 w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-semibold shadow-lg" aria-disabled={isPending}>
          Log in <ArrowRightIcon className="ml-auto h-5 w-5 text-white" />
        </Button>

        <div className="flex h-8 items-end justify-center space-x-1 mt-2" aria-live="polite" aria-atomic="true">
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
