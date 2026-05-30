/**
 * Shared copyright footer rendered below every auth card.
 * Year is computed at render time — no hydration mismatch risk since the
 * admin portal is a server-only internal tool with no SSG caching.
 */
export const AuthPageFooter = () => (
  <p className="mt-6 text-center text-xs text-white/30">
    © {new Date().getFullYear()} Chốt Đơn — Admin Portal
  </p>
);

AuthPageFooter.displayName = "AuthPageFooter";
