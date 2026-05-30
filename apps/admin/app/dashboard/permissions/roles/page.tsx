import { type Metadata } from "next";

import { PermissionsView } from "@/components/organisms/permissions-view";

export const metadata: Metadata = {
  title: "Roles & Permissions",
};

export default function RolesPermissionsPage() {
  return <PermissionsView />;
}
