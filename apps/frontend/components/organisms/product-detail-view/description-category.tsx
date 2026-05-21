import { TYPOGRAPHY } from "@/constants/typography";
import { useTranslations } from "next-intl";

interface DescriptionCategoryProps {
  name: string;
  category?: string;
  description?: string;
}

export const DescriptionCategory = ({
  name,
  category,
  description,
}: DescriptionCategoryProps) => {
  const t = useTranslations("ProductDetailPage");
  return (
    <div className="bg-surface border border-content/[0.05] rounded-2xl p-8 shadow-sm space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-0.5 bg-primary/10 text-primary ${TYPOGRAPHY.badge} rounded uppercase tracking-wider border border-primary/10`}
          >
            {category || t("general")}
          </span>
        </div>
        <h2 className={`${TYPOGRAPHY.sectionTitle} text-content leading-tight`}>
          {name}
        </h2>
      </div>

      <div className="pt-6 border-t border-content/[0.05]">
        <h3
          className={`${TYPOGRAPHY.label} uppercase tracking-widest mb-4 opacity-50`}
        >
          {t("productDescription")}
        </h3>
        <div
          className={`text-content/70 ${TYPOGRAPHY.bodySmall} leading-relaxed space-y-4 prose prose-sm max-w-none`}
          dangerouslySetInnerHTML={{
            __html: description || t("noDescription"),
          }}
        />
      </div>
    </div>
  );
};
