import Footer from "@/components/atoms/footer";
import Header from "@/components/molecules/header";

export default async function MainLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang || "en";

  return (
    <div className="min-h-full flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
