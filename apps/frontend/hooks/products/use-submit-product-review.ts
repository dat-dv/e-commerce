import { useAuthStore } from "@/hooks/auth/use-auth-store";
import { productsUseCase } from "@/domain/products/use-cases";
import { RequestError } from "@/utils/request/request-creator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { ReviewSubmitSchema, reviewSubmitSchema } from "./review-submit.schema";

const getSubmitReviewErrorMessage = (error: unknown) => {
  if (error instanceof RequestError) return error.message;
  if (error instanceof Error) return error.message;
  return "Review could not be submitted. Please try again.";
};

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
  const user = useAuthStore((state) => state.user);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submitReviewError, setSubmitReviewError] = useState<string | null>(
    null,
  );

  const methods = useForm<ReviewSubmitSchema>({
    resolver: zodResolver(reviewSubmitSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const submitReview = async (data: ReviewSubmitSchema) => {
    if (!user?.id) {
      setSubmitReviewError("Please sign in before submitting a review.");
      return;
    }

    if (!skuId) {
      setSubmitReviewError("This product variant is unavailable for review.");
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
      toast.success("Review submitted.");
      onSubmitted?.();
    } catch (error) {
      setSubmitReviewError(getSubmitReviewErrorMessage(error));
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
