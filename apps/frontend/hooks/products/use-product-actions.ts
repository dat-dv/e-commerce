import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCartStore } from "@/hooks/cart/use-cart-store";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";

export const useProductActions = (
  product: TProduct,
  selectedSku: TSkuDomain,
  selectedAttributes: Record<string, string>,
  quantity: number,
  imageUrl?: string,
) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!user) {
      toast.info("Please sign in to perform this action", {
        toastId: "auth-required",
      });
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    if (!selectedSku) return;

    addItem(
      {
        id: selectedSku.id,
        product_id: product.id,
        sku_id: selectedSku.id,
        name: product.name,
        price: selectedSku.price || 0,
        image_url: imageUrl || product.image_url || "",
        attributes: Object.entries(selectedAttributes)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
      },
      quantity,
    );
    toast.success("Added to cart successfully");
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info("Please sign in to buy items");
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    handleAddToCart();
    router.push(APP_ROUTES.CART);
  };

  return { handleAddToCart, handleBuyNow };
};
