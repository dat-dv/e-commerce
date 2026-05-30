interface IAuthSuccessBannerProps {
  message: string;
}

/**
 * Green alert banner shown after a successful async action
 * (e.g. password-reset email sent). Rendered conditionally by the parent.
 */
export const AuthSuccessBanner = ({ message }: IAuthSuccessBannerProps) => (
  <div className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <p className="text-sm text-emerald-300">{message}</p>
  </div>
);

AuthSuccessBanner.displayName = "AuthSuccessBanner";
