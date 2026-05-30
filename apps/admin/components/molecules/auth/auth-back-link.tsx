interface IAuthBackLinkProps {
  href: string;
  label: string;
}

export const AuthBackLink = ({ href, label }: IAuthBackLinkProps) => (
  <div className="mb-6 flex items-center gap-3">
    <a
      href={href}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
      aria-label={label}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 19l-7-7 7-7"
        />
      </svg>
    </a>
    <span className="text-sm font-medium text-white/40">{label}</span>
  </div>
);

AuthBackLink.displayName = "AuthBackLink";
