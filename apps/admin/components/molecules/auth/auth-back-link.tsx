interface IAuthBackLinkProps {
  href: string;
  label: string;
}

export const AuthBackLink = ({ href, label }: IAuthBackLinkProps) => (
  <div className="mb-6 flex items-center gap-3">
    <a
      href={href}
      className="text-content/60 hover:bg-primary/10 hover:text-primary flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--card-bg)] transition-colors"
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
    <span className="text-content/50 text-sm font-medium">{label}</span>
  </div>
);

AuthBackLink.displayName = "AuthBackLink";
