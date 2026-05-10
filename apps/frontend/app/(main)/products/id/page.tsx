import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Details",
  description: "View product details.",
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
      <h1 className="text-4xl font-black mb-4">Product Details</h1>
      <p className="text-content/60 text-lg">
        Viewing details for product ID:{" "}
        <span className="font-bold text-primary">{id}</span>
      </p>
    </div>
  );
}
