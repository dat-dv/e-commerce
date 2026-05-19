import TableOfContents from "@/components/molecules/toc";
import { useTranslations } from "next-intl";

interface SettingsSidebarProps {
  items: { id: string; title: string }[];
}

const SettingsSidebar = ({ items }: SettingsSidebarProps) => {
  const t = useTranslations("SettingsPage.navigation");

  return (
    <div>
      <h3 className="text-sm font-bold text-content/40 uppercase tracking-wider mb-3">
        {t("title")}
      </h3>
      <TableOfContents items={items} />
    </div>
  );
};

export default SettingsSidebar;
