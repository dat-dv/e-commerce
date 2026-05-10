import type { Metadata } from 'next';

import SignUpForm from '@/components/molecules/sign-up-form';

export const metadata: Metadata = {
  title: 'Sign Up',
  description: 'Join us to experience a premium, real-time task management environment.',
};

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center w-full">
      <SignUpForm />
    </div>
  );
}
