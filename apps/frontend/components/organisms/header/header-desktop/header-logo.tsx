import Logo from "@/components/atoms/logo";
import { APP_ROUTES } from "@/constants/routes";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <Link
      href={APP_ROUTES.HOME}
      aria-label="Go to homepage"
      className="focus-visible:ring-primary/40 focus-visible:ring-offset-surface rounded-xl transition-opacity outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:opacity-80"
    >
      <Logo />
    </Link>
  );
};

export default HeaderLogo;
