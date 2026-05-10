import Button from '@/components/atoms/button';
import ProtectedSection from '@/components/atoms/protected-section/protected-section';
import { APP_ROUTES } from '@/constants/routes';

import AvatarDropdown from '../avatar-dropdown';

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-2 md:gap-3 ml-1 md:ml-2 border-l border-black/[.08] pl-2 md:pl-5">
      <ProtectedSection
        fallbackChildren={
          <>
            <Button variant="ghost" size="sm" href={APP_ROUTES.SIGN_IN} className="hidden sm:flex">
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="h-8 px-3 text-xs md:h-10 md:px-4 md:text-sm"
              href={APP_ROUTES.SIGN_UP}
            >
              Sign Up
            </Button>
          </>
        }
      >
        <AvatarDropdown />
      </ProtectedSection>
    </div>
  );
}
