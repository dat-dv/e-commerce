export const dynamicParams = false;

export function generateStaticParams() {
  return [{ locale: "vi" }, { locale: "en" }];
}

export default function LocalizedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
