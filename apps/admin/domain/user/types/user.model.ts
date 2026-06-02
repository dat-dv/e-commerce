export interface IAdminRole {
  id: string;
  roleName: string;
  description: string | null;
  permissions: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IAdminUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth?: string | null;
  gender?: number | null;
  avatarId?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  roleId: string;
  role?: IAdminRole | null;
  avatar?: { url: string } | null;
  avatarUrl?: string | null;
  phones?: Array<{
    id: string;
    phone: string;
    phone_code: string;
    is_verified: boolean;
  }>;
}

export interface IAdminUserAvatar {
  id: string;
  imageId: string;
  url: string;
  width: number | null;
  height: number | null;
  format: string | null;
  isCurrent: boolean;
  createdAt: string;
}

export interface IAdminUpdateUserInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: number;
  avatarId?: string;
  roleId?: string;
}

export interface IAdminCustomerOrder {
  id: string;
  status: number;
  totalAmount: number;
  discountAmount: number;
  createdAt: string;
  updatedAt: string;
  itemCount: number;
}

export interface IAdminCustomerCartItem {
  id: string;
  skuId: string;
  skuCode: string;
  productName: string;
  productSlug: string;
  thumbnailUrl: string | null;
  quantity: number;
  price: number;
  unitPrice: string;
}

export interface IAdminCustomerCart {
  id: string;
  createdAt: string;
  updatedAt: string;
  items: IAdminCustomerCartItem[];
  totalItems: number;
  subtotal: number;
}

export interface IAdminCustomerFavoriteProduct {
  productId: string;
  productName: string;
  productSlug: string;
  thumbnailUrl: string | null;
  basePrice: number;
  createdAt: string;
}

export interface IAdminCustomerActivityItem {
  id: string;
  type: "account" | "order" | "cart" | "favorite";
  title: string;
  description: string;
  occurredAt: string;
}
