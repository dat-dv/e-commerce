"use client";

import { Tab, TabList, TabPanel, Tabs } from "@ecommerce/ui";
import { Heart, ShoppingCart, User } from "lucide-react";

import { EmptyTabState } from "@/components/molecules/empty-tab-state";
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
        <Tab id="activity">Activity</Tab>
      </TabList>

      <TabPanel id="info" className="mt-0">
        <UserDetailInfoTab userId={userId} />
      </TabPanel>

      <TabPanel id="orders" className="mt-0">
        <UserDetailOrdersTab userId={userId} />
      </TabPanel>

      <TabPanel id="cart" className="mt-0">
        <EmptyTabState
          icon={ShoppingCart}
          title="Cart snapshot will appear here"
          description="This tab is reserved for viewing the customer cart once the backend exposes an admin cart lookup by user id."
        />
      </TabPanel>

      <TabPanel id="favorites" className="mt-0">
        <EmptyTabState
          icon={Heart}
          title="Favorites will appear here"
          description="This tab is reserved for favorite products and categories tied to this customer."
        />
      </TabPanel>

      <TabPanel id="activity" className="mt-0">
        <EmptyTabState
          icon={User}
          title="Activity timeline will appear here"
          description="This tab can collect login events, profile changes, reviews, returns, and support activity."
        />
      </TabPanel>
    </Tabs>
  );
};

UserDetailTabs.displayName = "UserDetailTabs";
