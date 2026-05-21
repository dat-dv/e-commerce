import TableOfContents from "@/components/molecules/toc";
import { useTranslations } from "next-intl";

interface SettingsSidebarProps {
  items: { id: string; title: string }[];
}

const SettingsSidebar = ({ items }: SettingsSidebarProps) => {
  const t = useTranslations("SettingsPage.navigation");

  return (
    <div>
      <h3 className="text-content/40 mb-3 text-sm font-bold tracking-wider uppercase">
        {t("title")}
      </h3>
      <TableOfContents items={items} />
    </div>
  );
};

export default SettingsSidebar;
