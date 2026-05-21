"use client";

import { APP_ROUTES } from "@/constants/routes";
import { TYPOGRAPHY } from "@/constants/typography";
import { TProduct } from "@/domain/products/types/products.model";
import Link from "next/link";
import { ReactNode } from "react";

interface ProductCardInfoProps {
  product: TProduct;
  badgeText?: string;
  titleHoverClassName: string;
  children?: ReactNode;
}

export function ProductCardInfo({
  product,
  badgeText,
  titleHoverClassName,
  children,
}: ProductCardInfoProps) {
  return (
    <div className="mt-3 flex flex-col flex-grow">
      {badgeText ? (
        <span className={`${TYPOGRAPHY.badge} text-content/40 truncate`}>
          {badgeText}
        </span>
      ) : null}

      <h3
        className={`mt-1 ${TYPOGRAPHY.cardTitle} text-content line-clamp-1 transition-colors ${titleHoverClassName}`}
      >
        <Link href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}>
          {product.name}
        </Link>
      </h3>

      {children}
    </div>
  );
}
