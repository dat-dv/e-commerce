import { toast } from "@/components/atoms/toast";
import { productsUseCase } from "@/domain/products/use-cases";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  ReviewSubmitSchema,
  getReviewSubmitSchema,
} from "./review-submit.schema";

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
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState<string | null>(
    null,
  );
  const schema = useMemo(() => getReviewSubmitSchema(t), [t]);

  const getSubmitReviewErrorMessage = (error: Error) => {
    return error.message || t("submitFailed");
  };

  const methods = useForm<ReviewSubmitSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      rating: 5,
      comment: "",
    },
    resetOptions: {
      keepDefaultValues: true,
    },
  });

  useEffect(() => {
    methods.reset();
  }, [productId, skuId, methods]);

  const submitReview = async (data: ReviewSubmitSchema) => {
    setIsSubmittingReview(true);

    try {
      await productsUseCase.createReview.execute({
        productId,
        skuId: skuId!,
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
    isSubmittingReview,
    submitReviewError,
    submitReview,
  };
};
