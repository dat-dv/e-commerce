import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAddToCart } from "@/hooks/cart/use-add-to-cart";
import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { APP_ROUTES, CALLBACK_URL_KEY } from "@/constants/routes";
import { TProduct, TSkuDomain } from "@/domain/products/types/products.model";
import { useTranslations } from "next-intl";

export const useProductActions = (
  product: TProduct,
  selectedSku: TSkuDomain,
  selectedAttributes: Record<string, string>,
  quantity: number,
  imageUrl?: string,
) => {
  const t = useTranslations("ProductDetailPage");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const addItem = useAddToCart();

  const handleAddToCart = () => {
    if (!user) {
      toast.info(t("signInForAction"), {
        toastId: "auth-required",
      });
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    if (!selectedSku) return;

    addItem(
      {
        id: "",
        productId: String(product.id),
        skuId: selectedSku.id,
        name: product.name,
        price: selectedSku.price || 0,
        originalPrice: selectedSku.originalPrice,
        discountPercent: selectedSku.discountPercent,
        imageUrl: imageUrl || product.imageUrl || "",
        attributes: Object.entries(selectedAttributes)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", "),
      },
      quantity,
    );
    toast.success(t("addToCartSuccess"));
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.info(t("signInToBuy"));
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`${APP_ROUTES.SIGN_IN}?${CALLBACK_URL_KEY}=${callbackUrl}`);
      return;
    }

    handleAddToCart();
    router.push(APP_ROUTES.CART);
  };

  return { handleAddToCart, handleBuyNow };
};
