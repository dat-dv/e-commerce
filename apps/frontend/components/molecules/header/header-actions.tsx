import Button from "@/components/atoms/button";
import ProtectedSection from "@/components/atoms/protected-section/protected-section";
import { APP_ROUTES } from "@/constants/routes";

import AvatarDropdown from "../avatar-dropdown";

export default function HeaderActions() {
  return (
    <div className="flex items-center gap-2 md:gap-3 ml-1 md:ml-2">
      <ProtectedSection
        fallbackChildren={
          <>
            <Button
              variant="ghost"
              size="sm"
              href={APP_ROUTES.SIGN_IN}
              className="hidden sm:flex h-9 px-4 text-sm md:h-10 md:px-4 md:text-sm"
            >
              Sign In
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="h-9 px-4 text-sm md:h-10 md:px-4 md:text-sm"
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
