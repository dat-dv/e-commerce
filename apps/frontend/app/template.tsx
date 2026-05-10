import ScrollToTop from "@/components/atoms/scroll-to-top";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
}
