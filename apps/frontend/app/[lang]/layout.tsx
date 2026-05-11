import { language } from "@/constants/countries";

export async function generateStaticParams() {
  return Object.keys(language).map((key) => ({ lang: key }));
}

export default function LangLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
