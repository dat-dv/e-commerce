import ScrollToTop from "@/components/atoms/scroll-to-top";
import RequireProfileInfoModal from "@/components/molecules/require-profile-info";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      <RequireProfileInfoModal />
      {children}
    </>
  );
}
