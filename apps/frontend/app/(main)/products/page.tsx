import { redirect } from "next/navigation";
import { APP_ROUTES } from "@/constants/routes";

export default async function ProductsRootPage() {
  redirect(APP_ROUTES.CATEGORIES);
}
