import { Button, Dialog, DialogPanel, DialogTitle } from "@ecommerce/ui";
import { Package, Star } from "lucide-react";

import {
  formatCurrency,
  getProductStatus,
} from "@/components/organisms/products-view/product.utils";
import type { IAdminProduct } from "@/domain/product";

interface IProductDetailDialogProps {
  product: IAdminProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductDetailDialog = ({
  product,
  isOpen,
  onClose,
}: IProductDetailDialogProps) => {
  const name = product?.translations?.[0]?.name ?? "";
  const statusInfo = product ? getProductStatus(product.status) : null;

  return (
    <Dialog isOpen={isOpen} onClose={onClose}>
      <DialogPanel className="border-content/10 bg-surface/95 max-w-xl rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl">
        <DialogTitle className="text-xl font-bold text-[var(--app-text)]">
          Product Details
        </DialogTitle>

        {product && statusInfo && (
          <div className="mt-6 space-y-5">
            {/* Thumbnail + Name */}
            <div className="border-content/5 bg-content/[0.02] flex items-center gap-4 rounded-xl border p-4">
              <div className="border-content/10 bg-content/[0.02] flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border">
                {product.thumbnail?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.thumbnail.url}
                    alt={name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Package className="h-8 w-8 text-[var(--muted)]" />
                )}
              </div>
              <div>
                <h4 className="text-base font-bold text-[var(--app-text)]">
                  {name}
                </h4>
                <code className="text-xs text-[var(--muted)]">
                  {product.slug}
                </code>
                <div className="mt-1.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${statusInfo.color}`}
                  >
                    {statusInfo.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-3">
              <div className="border-content/5 bg-content/[0.02] rounded-xl border px-3 py-3 text-center">
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Price
                </p>
                <p className="mt-1 text-sm font-bold text-emerald-400">
                  {formatCurrency(product.basePrice)}
                </p>
              </div>
              <div className="border-content/5 bg-content/[0.02] rounded-xl border px-3 py-3 text-center">
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Rating
                </p>
                <div className="mt-1 flex items-center justify-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-[var(--app-text)]">
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="border-content/5 bg-content/[0.02] rounded-xl border px-3 py-3 text-center">
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Sold
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--app-text)]">
                  {product.soldCount}
                </p>
              </div>
            </div>

            {/* SKUs */}
            {product.skus && product.skus.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  SKUs ({product.skus.length})
                </p>
                <div className="border-content/5 bg-content/[0.02] space-y-1.5 rounded-xl border p-3">
                  {product.skus.map((sku) => (
                    <div
                      key={sku.id}
                      className="flex items-center justify-between gap-2"
                    >
                      <code className="text-primary text-xs">
                        {sku.skuCode}
                      </code>
                      <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
                        <span>
                          Stock:{" "}
                          <b className="text-[var(--app-text)]">{sku.stock}</b>
                        </span>
                        <span className="font-semibold text-[var(--app-text)]">
                          {formatCurrency(sku.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reviews + Brand */}
            <div className="flex gap-3">
              <div className="border-content/5 bg-content/[0.02] flex-1 rounded-xl border px-4 py-3">
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Reviews
                </p>
                <p className="mt-1 text-base font-bold text-[var(--app-text)]">
                  {product.reviewCount}
                </p>
              </div>
              <div className="border-content/5 bg-content/[0.02] flex-1 rounded-xl border px-4 py-3">
                <p className="text-[10px] font-bold tracking-wider text-[var(--muted)] uppercase">
                  Brand
                </p>
                <p className="mt-1 text-sm font-bold text-[var(--app-text)]">
                  {product.brand?.slug ?? "—"}
                </p>
              </div>
            </div>

            {/* Close */}
            <div className="flex justify-end pt-2">
              <Button
                onClick={onClose}
                className="bg-primary shadow-primary/10 hover:bg-primary rounded-lg px-6 py-2.5 font-bold text-white shadow-lg"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </DialogPanel>
    </Dialog>
  );
};

ProductDetailDialog.displayName = "ProductDetailDialog";
