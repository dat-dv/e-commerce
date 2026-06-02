"use client";

import { Tab, TabList, TabPanel, Tabs } from "@ecommerce/ui";

import { UserDetailCartTab } from "@/components/organisms/user-detail-view/user-detail-cart-tab";
import { UserDetailFavoritesTab } from "@/components/organisms/user-detail-view/user-detail-favorites-tab";
import { UserDetailInfoTab } from "@/components/organisms/user-detail-view/user-detail-info-tab";
import { UserDetailOrdersTab } from "@/components/organisms/user-detail-view/user-detail-orders-tab";

export const UserDetailTabs = ({ userId }: { userId: string }) => {
  return (
    <Tabs defaultSelectedKey="info" className="gap-5">
      <TabList>
        <Tab id="info">Info</Tab>
        <Tab id="orders">Orders</Tab>
        <Tab id="cart">Cart</Tab>
        <Tab id="favorites">Favorites</Tab>
      </TabList>

      <TabPanel id="info" className="mt-0">
        <UserDetailInfoTab userId={userId} />
      </TabPanel>

      <TabPanel id="orders" className="mt-0">
        <UserDetailOrdersTab userId={userId} />
      </TabPanel>

      <TabPanel id="cart" className="mt-0">
        <UserDetailCartTab userId={userId} />
      </TabPanel>

      <TabPanel id="favorites" className="mt-0">
        <UserDetailFavoritesTab userId={userId} />
      </TabPanel>
    </Tabs>
  );
};

UserDetailTabs.displayName = "UserDetailTabs";
