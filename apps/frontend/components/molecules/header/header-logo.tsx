import Link from 'next/link';

import { APP_ROUTES } from '@/constants/routes';

const HeaderLogo = () => {
  return (
    <Link href={APP_ROUTES.HOME}>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold transition-all">
          S
        </div>
        <span className="text-lg md:text-xl font-bold tracking-tight text-content select-none">
          Task
          <span className="hidden sm:inline text-primary transition-all">.manager</span>
        </span>
      </div>
    </Link>
  );
};

export default HeaderLogo;
