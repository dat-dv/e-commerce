import type { Metadata } from 'next';

import { ProfileView } from '@/components/organisms/profile-view';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your personal profile and account details with ease.',
};

export default function ProfilePage() {
  return <ProfileView />;
}
