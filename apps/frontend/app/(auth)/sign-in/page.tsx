import type { Metadata } from 'next';

import SignInForm from '@/components/molecules/sign-in-form';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to manage your tasks and experience a premium user experience.',
};

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center">
      <SignInForm />
    </div>
  );
}
