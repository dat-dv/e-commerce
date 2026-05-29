import { AppDialog, AppDialogPanel } from "@ecommerce/ui";
import { TOrderItem } from "@/domain/orders/types/order.model";
import { useSubmitProductReview } from "@/hooks/products/use-submit-product-review";
import { AnimatePresence } from "framer-motion";
import { ReviewSubmitForm } from "../review-rating/review-submit-form";

interface ReviewModalProps {
  isOpen: boolean;
  orderItem?: TOrderItem;
  onSubmit?: () => void;
  onClose: () => void;
}

export const ReviewModal = ({
  isOpen,
  orderItem,
  onClose,
}: ReviewModalProps) => {
  const productId = orderItem?.sku?.product?.id ?? "";
  const skuId = orderItem?.sku?.id ?? "";

  const { methods, isSubmittingReview, submitReviewError, submitReview } =
    useSubmitProductReview({
      productId,
      skuId,
      onSubmitted: () => {
        onClose();
      },
    });

  return (
    <AnimatePresence>
      {isOpen ? (
        <AppDialog isOpen={isOpen} onClose={onClose}>
          <AppDialogPanel className="border-content/[0.06] bg-surface/90 my-6 w-full max-w-xl rounded-2xl border p-6 shadow-2xl backdrop-blur-2xl">
            <ReviewSubmitForm
              methods={methods}
              isSubmitting={isSubmittingReview}
              error={submitReviewError}
              onSubmit={submitReview}
            />
          </AppDialogPanel>
        </AppDialog>
      ) : null}
    </AnimatePresence>
  );
};

export default ReviewModal;
