"use client";

import { TCategory } from "@/domain/categories/types/categories.model";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronRight, Layers3 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CategoriesContentHeader } from "./categories-content-header";

interface CategoriesContentProps {
  categories: TCategory[];
  activeId: string;
}

const CATEGORY_PREVIEW_LIMIT = 6;

export const CategoriesContent = ({
  categories,
  activeId,
}: CategoriesContentProps) => {
  const t = useTranslations("CategoriesPage.content");
  const isAllCategories = activeId === "all";

  return (
    <div className="min-w-0 flex-1">
      <AnimatePresence mode="wait">
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="flex flex-col gap-6"
        >
          <div className="flex flex-col gap-6">
            <CategoriesContentHeader count={categories.length} />
            {isAllCategories ? (
              <motion.div
                className="grid grid-cols-1 gap-4 xl:grid-cols-2"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {categories.map((category) => {
                  const children = category.children ?? [];
                  const previewChildren = children.slice(
                    0,
                    CATEGORY_PREVIEW_LIMIT,
                  );
                  const hiddenChildrenCount =
                    children.length - previewChildren.length;

                  return (
                    <motion.section
                      key={category.id}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        show: { opacity: 1, y: 0 },
                      }}
                      className="group flex min-h-48 flex-col rounded-lg border border-content/[0.07] bg-surface p-4 transition-colors hover:border-primary/20"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <Link
                            href={`/categories/${category.slug}`}
                            className="inline-flex max-w-full items-center gap-2 text-lg font-black text-content transition-colors hover:text-primary"
                          >
                            <span className="truncate capitalize">
                              {category.name}
                            </span>
                            <ArrowRight
                              size={16}
                              strokeWidth={2.4}
                              aria-hidden
                              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                            />
                          </Link>

                          <p className="mt-1 text-sm font-semibold text-content/40">
                            {t("childCount", { count: children.length })}
                          </p>
                        </div>

                        <Link
                          href={`/categories/${category.slug}`}
                          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-content/[0.06] text-content/45 transition-colors hover:border-primary/30 hover:text-primary"
                          aria-label={t("viewCategory", {
                            category: category.name,
                          })}
                        >
                          <ChevronRight
                            size={17}
                            strokeWidth={2.4}
                            aria-hidden
                          />
                        </Link>
                      </div>

                      {previewChildren.length > 0 ? (
                        <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {previewChildren.map((child) => (
                            <Link
                              key={child.id}
                              href={`/categories/${child.slug}`}
                              className="flex min-h-11 items-center justify-between gap-3 rounded-lg bg-content/[0.025] px-3 py-2 text-sm font-bold text-content/70 transition-colors hover:bg-primary/10 hover:text-primary"
                            >
                              <span className="line-clamp-1 capitalize">
                                {child.name}
                              </span>
                              <ChevronRight
                                size={15}
                                strokeWidth={2.4}
                                aria-hidden
                                className="shrink-0 opacity-35"
                              />
                            </Link>
                          ))}

                          {hiddenChildrenCount > 0 && (
                            <Link
                              href={`/categories/${category.slug}`}
                              className="flex min-h-11 items-center justify-between gap-3 rounded-lg border border-dashed border-content/[0.1] px-3 py-2 text-sm font-black text-content/45 transition-colors hover:border-primary/25 hover:text-primary"
                            >
                              <span>
                                {t("viewMore", {
                                  count: hiddenChildrenCount,
                                })}
                              </span>
                              <ArrowRight
                                size={15}
                                strokeWidth={2.4}
                                aria-hidden
                                className="shrink-0"
                              />
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="mt-5 flex min-h-24 items-center rounded-lg bg-content/[0.025] px-4">
                          <p className="text-sm font-semibold text-content/35">
                            {t("noChildren")}
                          </p>
                        </div>
                      )}
                    </motion.section>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3"
                variants={{
                  hidden: { opacity: 0 },
                  show: {
                    opacity: 1,
                    transition: { staggerChildren: 0.05 },
                  },
                }}
                initial="hidden"
                animate="show"
              >
                {categories.map((child) => {
                  const childCount = child.children?.length ?? 0;

                  return (
                    <motion.div
                      key={child.id}
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        show: { opacity: 1, y: 0 },
                      }}
                    >
                      <Link
                        href={`/categories/${child.slug}`}
                        className="group flex min-h-24 items-center gap-4 rounded-lg border border-content/[0.07] bg-surface px-4 py-3 transition-colors hover:border-primary/25"
                      >
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Layers3 size={18} strokeWidth={2.2} aria-hidden />
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="line-clamp-2 text-sm font-black capitalize text-content transition-colors group-hover:text-primary">
                            {child.name}
                          </h4>
                          <p className="mt-1 text-xs font-semibold text-content/40">
                            {childCount > 0
                              ? t("childCount", { count: childCount })
                              : t("browseProducts")}
                          </p>
                        </div>

                        <ChevronRight
                          size={17}
                          strokeWidth={2.4}
                          aria-hidden
                          className="shrink-0 text-content/25 transition-colors group-hover:text-primary"
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
