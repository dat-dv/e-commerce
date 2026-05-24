import { AdminFlashSaleDetailView } from "@/components/organisms/admin-flash-sale-detail-view";
import { IServerPageProps } from "@/utils/request/request.types";

type IPageProps = IServerPageProps<{ id: string }>;

export default async function AdminFlashSaleDetailPage({ params }: IPageProps) {
  const { id } = await params;
  return <AdminFlashSaleDetailView id={id} />;
}
