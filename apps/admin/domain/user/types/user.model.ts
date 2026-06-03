export interface IAdminImage {
  id: string;
  url: string;
  publicId?: string | null;
  width?: number | null;
  height?: number | null;
  format?: string | null;
  bytes?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminUserPhone {
  id: string;
  phone: string;
  phoneCode: string;
  isVerified: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminPermission {
  id: string;
  permissionName: string;
  description?: string | null;
  category?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface IAdminRolePermission {
  permission: IAdminPermission;
}

export interface IAdminRole {
  id: string;
  roleName: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  permissions?: IAdminRolePermission[];
}

export interface IAdminUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  roleId?: string | null;
  avatarId?: string | null;
  activePhoneId?: string | null;
  role?: IAdminRole | null;
  avatar?: IAdminImage | null;
  activePhone?: IAdminUserPhone | null;
  phones?: IAdminUserPhone[];
}

export interface IAdminBrandTranslation {
  id: string;
  brandId: string;
  languageId: string;
  name: string;
  description?: string | null;
  story?: string | null;
}

export interface IAdminBrand {
  id: string;
  slug: string;
  logoId?: string | null;
  bannerId?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  websiteUrl?: string | null;
  foundedYear?: number | null;
  headquarters?: string | null;
  isVerified: boolean;
  isFeatured: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
  translations?: IAdminBrandTranslation[];
  logo?: IAdminImage | null;
  banner?: IAdminImage | null;
  productCount?: number;
  storyEn?: string;
}

export interface IAdminProductTranslation {
  id: string;
  productId: string;
  languageId: string;
  name: string;
  description?: string | null;
}

export interface IAdminProductCategoryTranslation {
  id: string;
  categoryId: string;
  languageId: string;
  name: string;
  description?: string | null;
}

export interface IAdminProductCategory {
  id: string;
  slug: string;
  imageId?: string | null;
  parentId?: string | null;
  level: number;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  translations?: IAdminProductCategoryTranslation[];
}

export interface IAdminProductCategoryMapping {
  productId: string;
  categoryId: string;
  category?: IAdminProductCategory;
}

export interface IAdminAttribute {
  id: string;
  name: string;
}

export interface IAdminAttributeValue {
  id: string;
  attributeId: string;
  value: string;
  attribute?: IAdminAttribute;
}

export interface IAdminSkuAttributeValue {
  skuId: string;
  attributeValueId: string;
  attributeValue?: IAdminAttributeValue;
}

export interface IAdminFlashSale {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  timeSlotId?: string | null;
}

export interface IAdminFlashSaleProduct {
  id: string;
  flashSaleId: string;
  skuId: string;
  salePrice: number;
  stock: number;
  soldCount: number;
  orderLimit: number;
  flashSale?: IAdminFlashSale;
}

export interface IAdminProduct {
  id: string;
  slug: string;
  sellerId?: string | null;
  brandId?: string | null;
  status: number;
  soldCount: number;
  reviewCount: number;
  rating?: number | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  basePrice: string | number;
  thumbnailId?: string | null;
  translations?: IAdminProductTranslation[];
  thumbnail?: IAdminImage | null;
  brand?: IAdminBrand | null;
  categories?: IAdminProductCategoryMapping[];
  skus?: IAdminSku[];
  isFavorited?: boolean;
}

export interface IAdminSku {
  id: string;
  productId: string;
  skuCode: string;
  price: string | number;
  originalPrice: string | number | null;
  stock: number;
  imageUrl?: string | null;
  unitPrice: string | null;
  flashSales?: IAdminFlashSaleProduct[];
  skuAttributeValues?: IAdminSkuAttributeValue[];
  product?: IAdminProduct;
}

export interface IAdminCustomerCartItem {
  id: string;
  cartId: string;
  skuId: string;
  quantity: number;
  sku?: IAdminSku;
}

export interface IAdminCustomerCart {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  items?: IAdminCustomerCartItem[];
}

export interface IAdminCustomerFavoriteProduct {
  userId: string;
  productId: string;
  createdAt: string;
  product?: IAdminProduct;
}

export interface IAdminOrderItem {
  id: string;
  orderId: string;
  skuId: string;
  flashSaleId?: string | null;
  quantity: number;
  price: string | number;
  snapshot?: unknown;
  sku?: IAdminSku;
}

export interface IAdminOrderUser {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
}

export interface IAdminShippingAddress {
  id: string;
  userId: string;
  receiverName: string;
  receiverPhone: string;
  label: number;
  latitude?: number | null;
  longitude?: number | null;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode?: string | null;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminCustomerOrder {
  id: string;
  userId: string;
  status: number;
  totalAmount: string | number;
  discountAmount: string | number;
  shippingAddressId?: string | null;
  couponId?: string | null;
  createdAt: string;
  updatedAt: string;
  items?: IAdminOrderItem[];
  shippingAddress?: IAdminShippingAddress | null;
  user?: IAdminOrderUser | null;
}

export interface IAdminUpdateUserInput {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  gender?: number;
  avatarId?: string;
  roleId?: string;
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

export interface IAdminGetUsersRequest {
  page?: number;
  limit?: number;
  search?: string;
  roleId?: string;
  gender?: string;
  sortBy?: string;
}
