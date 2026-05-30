import {
  type IProductResponse,
  type IUpdateProductTranslationRequest,
} from "@ecommerce/shared";
import { Globe, Info } from "lucide-react";

interface IProductTranslationsProps {
  product: IProductResponse;
  isEditing?: boolean;
  editTranslations?: IUpdateProductTranslationRequest[];
  setEditTranslations?: (
    translations: IUpdateProductTranslationRequest[],
  ) => void;
}

export const ProductTranslations = ({
  product,
  isEditing = false,
  editTranslations = [],
  setEditTranslations,
}: IProductTranslationsProps) => {
  const handleTranslationChange = (
    langId: string,
    field: "name" | "description",
    value: string,
  ) => {
    if (!setEditTranslations) return;
    setEditTranslations(
      editTranslations.map((t) =>
        t.language_id === langId ? { ...t, [field]: value } : t,
      ),
    );
  };

  return (
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
          {product.translations.map((translation) => {
            const editT =
              editTranslations.find(
                (x) => x.language_id === translation.language_id,
              ) || translation;
            return (
              <div
                key={translation.id}
                className="border-content/5 bg-content/[0.02] rounded-lg border p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="rounded bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-300 uppercase">
                    {translation.language_id}
                  </span>
                </div>
                <div className="space-y-3">
                  <div>
                    <h5 className="text-xs font-bold text-[var(--muted)] uppercase">
                      Name
                    </h5>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editT.name}
                        onChange={(e) =>
                          handleTranslationChange(
                            translation.language_id,
                            "name",
                            e.target.value,
                          )
                        }
                        className="mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      <p className="mt-0.5 text-sm font-semibold text-[var(--app-text)]">
                        {translation.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--muted)] uppercase">
                      Description
                    </h5>
                    {isEditing ? (
                      <textarea
                        value={editT.description || ""}
                        onChange={(e) =>
                          handleTranslationChange(
                            translation.language_id,
                            "description",
                            e.target.value,
                          )
                        }
                        rows={4}
                        className="mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1.5 text-sm leading-relaxed whitespace-pre-line text-[var(--app-text)] focus:border-indigo-500 focus:outline-none"
                      />
                    ) : (
                      translation.description && (
                        <p className="mt-0.5 text-sm leading-relaxed whitespace-pre-line text-[var(--app-text)]">
                          {translation.description}
                        </p>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-center gap-2 rounded-lg border border-yellow-500/10 bg-yellow-500/5 p-4 text-sm text-yellow-300">
          <Info className="h-4 w-4 shrink-0" />
          No translations available for this product.
        </div>
      )}
    </section>
  );
};

ProductTranslations.displayName = "ProductTranslations";
