import Footer from "@/components/atoms/footer";
import Header from "@/components/molecules/header";
import { CategoriesProvider } from "@/components/molecules/providers/categories-provider";
import { categoriesUseCase } from "@/domain/categories/use-cases";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categoriesRes = await categoriesUseCase.getTree.execute();
  const categories =
    categoriesRes.status === "success" ? categoriesRes.data : [];

  return (
    <CategoriesProvider initState={{ categories }}>
      <div className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CategoriesProvider>
  );
}
