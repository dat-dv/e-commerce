import { cn } from "@/utils/cn";
import { User, Bell, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileSidebarSection() {
  const pathname = usePathname();

  const sidebarItems = [
    {
      type: "header",
      label: "Account Settings",
    },
    {
      type: "group",
      label: "My Account",
      icon: User,
      items: [
        { href: "/profile", label: "Profile" },
        { href: "/profile/bank", label: "Bank Account" },
        { href: "/profile/address", label: "Addresses" },
        { href: "/profile/password", label: "Change Password" },
      ],
    },
    {
      type: "link",
      href: "/profile/notifications",
      label: "Notifications",
      icon: Bell,
    },
    {
      type: "link",
      href: "/orders",
      label: "My Purchases",
      icon: ShoppingBag,
    },
    {
      type: "link",
      href: "/cart",
      label: "My Cart",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="space-y-6">
      {sidebarItems.map((item, index) => {
        if (item.type === "header") {
          return (
            <h1
              key={index}
              className="text-sm font-bold tracking-wider text-content/40 uppercase mb-4 ml-1"
            >
              {item.label}
            </h1>
          );
        }

        if (item.type === "group") {
          const Icon = item.icon;
          return (
            <div key={index} className="space-y-1">
              <div className="font-bold text-content mb-2 flex items-center gap-2 px-3 py-2">
                {Icon && <Icon className="w-5 h-5 text-content/60" />}
                {item.label}
              </div>
              <ul className="space-y-1 ml-4">
                {item.items?.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      href={subItem.href}
                      className={cn(
                        "font-medium flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm",
                        pathname === subItem.href
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-content/60 hover:text-content hover:bg-content/5",
                      )}
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        }

        if (item.type === "link") {
          const Icon = item.icon;
          return (
            <div key={index}>
              <Link
                href={item.href || "/"}
                className={cn(
                  "font-bold flex items-center gap-2 px-3 py-2 rounded-xl transition-all text-sm",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-content/80 hover:text-primary hover:bg-primary/5",
                )}
              >
                {Icon && <Icon className="w-5 h-5 text-content/60" />}
                {item.label}
              </Link>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
