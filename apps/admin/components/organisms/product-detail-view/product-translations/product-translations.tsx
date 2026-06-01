import {
  type ILanguageListResponse,
  type IProductResponse,
} from "@ecommerce/shared";
import { Globe, Info } from "lucide-react";

import type { IProductFormState } from "@/hooks/product/use-product-detail-form";

interface IProductTranslationsProps {
  product: IProductResponse;
  languages?: ILanguageListResponse;
  isEditing?: boolean;
  formState?: IProductFormState | null;
  updateFormState?: <K extends keyof IProductFormState>(
    key: K,
    value: IProductFormState[K],
  ) => void;
}

export const ProductTranslations = ({
  product,
  languages = [],
  isEditing = false,
  formState,
  updateFormState,
}: IProductTranslationsProps) => {
  const handleTranslationChange = (
    langId: string,
    field: "name" | "description",
    value: string,
  ) => {
    if (!updateFormState || !formState) return;
    const current = formState.translations;
    const existingTranslation = current.find(
      (translation) => translation.language_id === langId,
    );

    if (existingTranslation) {
      updateFormState(
        "translations",
        current.map((translation) =>
          translation.language_id === langId
            ? { ...translation, [field]: value }
            : translation,
        ),
      );
      return;
    }

    updateFormState("translations", [
      ...current,
      {
        language_id: langId,
        name: field === "name" ? value : "",
        description: field === "description" ? value : "",
      },
    ]);
  };

  const existingTranslations = product.translations ?? [];
  const rows =
    isEditing && languages.length > 0
      ? languages.map((language) => {
          const translation = existingTranslations.find(
            (item) => item.language_id === language.id,
          );
          return {
            id: translation?.id ?? language.id,
            language_id: language.id,
            languageLabel: `${language.name} (${language.code})`,
            name: translation?.name ?? "",
            description: translation?.description ?? "",
          };
        })
      : existingTranslations.map((translation) => ({
          id: translation.id,
          language_id: translation.language_id,
          languageLabel:
            languages.find(
              (language) => language.id === translation.language_id,
            )?.name ?? translation.language_id,
          name: translation.name,
          description: translation.description ?? "",
        }));

  return (
    <section className="rounded-xl border border-[var(--border-color)] bg-[var(--card-bg)] p-5 shadow-xl backdrop-blur-xl">
      <div className="mb-5">
        <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--app-text)]">
          <Globe className="text-primary h-5 w-5" />
          Product Translations & Content
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Locales and language-specific details.
        </p>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-4">
          {rows.map((translation) => {
            const editT = formState
              ? formState.translations.find(
                  (x) => x.language_id === translation.language_id,
                ) || translation
              : translation;
            return (
              <div
                key={translation.id}
                className="border-content/5 bg-content/[0.02] rounded-lg border p-4"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="bg-primary/10 text-primary rounded px-2.5 py-0.5 text-xs font-bold uppercase">
                    {translation.languageLabel}
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
                        className="focus:border-primary mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--app-text)] focus:outline-none"
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
                        className="focus:border-primary mt-1 w-full rounded-md border border-[var(--border-color)] bg-[var(--card-bg)] px-3 py-1.5 text-sm leading-relaxed whitespace-pre-line text-[var(--app-text)] focus:outline-none"
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
