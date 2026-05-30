import { redirect } from "next/navigation";

/** Root redirects to the dashboard. Auth guard will be added later. */
export default function RootPage() {
  redirect("/sign-in");
}
