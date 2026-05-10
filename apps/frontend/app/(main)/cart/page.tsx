import AppContainer from '@/components/atoms/app-container';
import Button from '@/components/atoms/button';
import { APP_ROUTES } from '@/constants/routes';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cart',
  description: 'Your shopping cart.',
};

export default function CartPage() {
  return (
    <AppContainer
      size="2xl"
      className="py-16 animate-in fade-in slide-in-from-bottom-6 duration-700 flex flex-col items-center justify-center min-h-[50vh] text-center"
    >
      <div className="text-6xl mb-4">🛒</div>
      <h1 className="text-3xl font-black mb-2 text-content">Your Cart</h1>
      <p className="text-content/40 text-sm mb-8">Your cart is currently empty.</p>
      <Button href="/products" variant="primary" size="lg" className="rounded-2xl px-8">
        Start Shopping
      </Button>
    </AppContainer>
  );
}
