import { ProductsProvider } from "@/components/molecules/providers/products-provider";
import { ProfileView } from "@/components/organisms/profile-view";

export default function ProfilePage() {
  return (
    <ProductsProvider>
      <ProfileView />
    </ProductsProvider>
  );
}
