export interface ICartItem {
  id: string; // Thường là SKU ID
  product_id: string;
  sku_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  attributes?: string; // Ví dụ: "Màu: Đen, Size: L"
}

export interface ICartStoreState {
  items: ICartItem[];
  loading: boolean;
  isOpen: boolean;
  _hasHydrated: boolean;
}

export interface ICartStoreActions {
  addItem: (item: Omit<ICartItem, "quantity">, quantity: number) => void;
  removeItem: (sku_id: string) => void;
  updateQuantity: (sku_id: string, quantity: number) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
}

export type ICartStore = ICartStoreState & ICartStoreActions;
