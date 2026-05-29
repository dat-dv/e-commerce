import BasicLoading from "./basic-loading";
import ShopLoading from "./shop-loading";

export default function Loading({
  type = "default",
}: {
  type?: "shop" | "default";
}) {
  switch (type) {
    case "shop":
      return <ShopLoading />;
    default:
      return <BasicLoading />;
  }
}

Loading.displayName = "Loading";
