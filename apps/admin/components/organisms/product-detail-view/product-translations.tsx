import { type IProductResponse } from "@ecommerce/shared";
import { Globe, Info } from "lucide-react";

interface IProductTranslationsProps {
  product: IProductResponse;
}

export const ProductTranslations = ({ product }: IProductTranslationsProps) => (
  <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl">
    <div className="mb-5">
      <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--app-text)]">
        <Globe className="h-5 w-5 text-indigo-400" />
        Product Translations & Content
      </h2>
      <p className="mt-1 text-sm text-[var(--muted)]">
        Locales and language-specific details.
      </p>
    </div>

    {product.translations && product.translations.length > 0 ? (
      <div className="space-y-4">
        {product.translations.map((t) => (
          <div
            key={t.id}
            className="border-content/5 bg-content/[0.02] rounded-lg border p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-300 uppercase">
                {t.language_id}
              </span>
            </div>
            <div className="space-y-3">
              <div>
                <h5 className="text-xs font-bold text-[var(--muted)] uppercase">
                  Name
                </h5>
                <p className="mt-0.5 text-sm font-semibold text-[var(--app-text)]">
                  {t.name}
                </p>
              </div>
              {t.description && (
                <div>
                  <h5 className="text-xs font-bold text-[var(--muted)] uppercase">
                    Description
                  </h5>
                  <p className="mt-0.5 text-sm leading-relaxed whitespace-pre-line text-[var(--app-text)]">
                    {t.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex items-center gap-2 rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-4 text-sm text-yellow-300">
        <Info className="h-4 w-4 shrink-0" />
        No translations available for this product.
      </div>
    )}
  </section>
);

ProductTranslations.displayName = "ProductTranslations";
