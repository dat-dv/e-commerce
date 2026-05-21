import { UI_RADIUS } from "@/constants/ui-radius";
import { cn } from "@/utils/cn";
import { Link } from "lucide-react";

function ProfileSideBarLink({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition-all",
        UI_RADIUS.panel,
        active
          ? "bg-primary/10 text-primary"
          : "text-content/50 hover:bg-content/[0.04] hover:text-content",
      )}
    >
      <Icon
        size={17}
        strokeWidth={2}
        className={cn(active ? "text-primary" : "text-content/35")}
      />

      <span>{label}</span>

      {active && <span className="bg-primary ml-auto size-1.5 rounded-full" />}
    </Link>
  );
}

export default ProfileSideBarLink;
