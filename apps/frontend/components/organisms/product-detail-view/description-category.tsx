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
    <div className="bg-surface border-content/[0.05] space-y-6 rounded-2xl border p-8 shadow-sm">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span
            className={`bg-primary/10 text-primary px-2 py-0.5 ${TYPOGRAPHY.badge} border-primary/10 rounded border tracking-wider uppercase`}
          >
            {category || t("general")}
          </span>
        </div>
        <h2 className={`${TYPOGRAPHY.sectionTitle} text-content leading-tight`}>
          {name}
        </h2>
      </div>

      <div className="border-content/[0.05] border-t pt-6">
        <h3
          className={`${TYPOGRAPHY.label} mb-4 tracking-widest uppercase opacity-50`}
        >
          {t("productDescription")}
        </h3>
        <div
          className={`text-content/70 ${TYPOGRAPHY.bodySmall} prose prose-sm max-w-none space-y-4 leading-relaxed`}
          dangerouslySetInnerHTML={{
            __html: description || t("noDescription"),
          }}
        />
      </div>
    </div>
  );
};
