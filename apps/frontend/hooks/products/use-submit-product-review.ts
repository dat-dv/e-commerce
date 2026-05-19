import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { productsUseCase } from "@/domain/products/use-cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  ReviewSubmitSchema,
  getReviewSubmitSchema,
} from "./review-submit.schema";
import { useTranslations } from "next-intl";

type UseSubmitProductReviewParams = {
  productId: string;
  skuId?: string;
  onSubmitted?: () => void;
};

export const useSubmitProductReview = ({
  productId,
  skuId,
  onSubmitted,
}: UseSubmitProductReviewParams) => {
  const t = useTranslations("ProductDetailPage");
  const user = useAuthStore((state) => state.user);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState<string | null>(
    null,
  );

  const getSubmitReviewErrorMessage = (error: Error) => {
    return error.message || t("submitFailed");
  };

  const methods = useForm<ReviewSubmitSchema>({
    resolver: zodResolver(getReviewSubmitSchema((key) => t(key))),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const submitReview = async (data: ReviewSubmitSchema) => {
    if (!user?.id) {
      setSubmitReviewError(t("authRequired"));
      return;
    }

    if (!skuId) {
      setSubmitReviewError(t("variantUnavailable"));
      return;
    }

    setIsSubmittingReview(true);
    setSubmitReviewError(null);

    try {
      await productsUseCase.createReview.execute({
        productId,
        skuId,
        rating: data.rating,
        comment: data.comment?.trim() || undefined,
        images: [],
      });

      methods.reset({
        rating: 0,
        comment: "",
      });
      toast.success(t("submitSuccess"));
      onSubmitted?.();
    } catch (error) {
      setSubmitReviewError(
        getSubmitReviewErrorMessage(
          error instanceof Error ? error : new Error(),
        ),
      );
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return {
    methods,
    isAuthenticated: !!user?.id,
    isSubmittingReview,
    submitReviewError,
    submitReview,
  };
};
