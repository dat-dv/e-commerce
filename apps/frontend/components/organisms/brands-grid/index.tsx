"use client";

import AppContainer from "@/components/atoms/app-container";
import EmptyState from "@/components/molecules/empty-space";
import BrandsHeader from "@/components/organisms/brands-grid/brands-header";
import { brandsUseCase } from "@/domain/brands/use-cases";
import { TBrand } from "@/domain/homepage/types/homepage.model";
import usePagination from "@/hooks/use-pagination";
import { IPaginationMeta } from "@/utils/request/request.types";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import DiscoveryCarouselSection from "../discovery-sections";
import BrandListGrid from "./brands-list";

interface TopBrandsViewProps {
  initialData: { items: TBrand[]; meta: IPaginationMeta } | null;
}

const BrandsView = ({ initialData }: TopBrandsViewProps) => {
  const t = useTranslations("BrandsPage");
  const { data, loading, getData, router } = usePagination<TBrand>({
    isSyncWithSearchParams: true,
    initialData,
    fetchPage: (params) =>
      brandsUseCase.getTopBrands.execute(
        params.page,
        params.limit,
        params.search,
      ),
  });

  return (
    <AppContainer className="flex flex-col gap-12 pb-12">
      <BrandsHeader />
      {data.items.length > 0 ? (
        <BrandListGrid
          brands={data.items}
          loadingMore={loading}
          hasMore={data.meta.page < data.meta.totalPages}
          loadMore={() => getData({ page: data.meta.page + 1 })}
        />
      ) : (
        <EmptyState
          title={t("empty.title")}
          description={t("empty.description", {
            query: router.routerState.search,
          })}
          icon={Search}
        />
      )}
      <DiscoveryCarouselSection />
    </AppContainer>
  );
};

export default BrandsView;
