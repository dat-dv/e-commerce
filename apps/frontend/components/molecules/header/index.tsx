import AppContainer from '@/components/atoms/app-container';

import ThemeSwitcher from '../theme-switcher';
import HeaderActions from './header-actions';
import HeaderLogo from './header-logo';
import HeaderNav from './header-nav';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[.08] bg-surface/80 backdrop-blur-md">
      <AppContainer className="flex h-16 items-center justify-between">
        <div className="flex items-center gap-4 md:gap-10">
          <HeaderLogo />
          <HeaderNav />
        </div>

        <div className="flex items-center gap-2 md:gap-6">
          <ThemeSwitcher />
          <HeaderActions />
        </div>
      </AppContainer>
    </header>
  );
}
