import useAppRouter from "@/hooks/use-native-router";
import { useTranslations } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  buildSearchOptions,
  resolveDefaultRoute,
} from "../utils/search-routes";

export type SearchFormValues = {
  search: string;
  route: string;
};

export const useSearchForm = () => {
  const t = useTranslations("Common.search");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useAppRouter({ updateUrl: true });

  const defaultRoute = resolveDefaultRoute(pathname);

  const methods = useForm<SearchFormValues>({
    defaultValues: {
      search: searchParams.get("search") || "",
      route: defaultRoute,
    },
  });

  useEffect(() => {
    methods.reset({
      search: searchParams.get("search") || "",
      route: resolveDefaultRoute(pathname),
    });
  }, [pathname, searchParams, methods]);

  const onSubmit = ({ search, route }: SearchFormValues) => {
    const keyword = search.trim();
    if (!keyword) return;

    router.push({
      pathname: route,
      search: keyword,
    });
  };

  const options = buildSearchOptions(pathname, t);

  return {
    methods,
    onSubmit,
    options,
  };
};
