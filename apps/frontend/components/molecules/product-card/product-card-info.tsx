"use client";

import { APP_ROUTES } from "@/constants/routes";
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
        <span className="text-[10px] text-content/40 font-bold truncate">
          {badgeText}
        </span>
      ) : null}

      <h3
        className={`mt-1 text-sm font-bold text-content line-clamp-1 transition-colors ${titleHoverClassName}`}
      >
        <Link href={APP_ROUTES.PRODUCT_DETAIL(product.slug)}>
          {product.name}
        </Link>
      </h3>

      {children}
    </div>
  );
}
