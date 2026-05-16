export interface TCartItem {
  id: string;
  productId: string;
  skuId: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  discountPercent?: number | null;
  quantity: number;
  imageUrl?: string | null;
  attributes?: string;
}

export interface TCartStoreState {
  items: TCartItem[];
  selectedSkuIds: string[];
  loading: boolean;
  isOpen: boolean;
  hasHydrated: boolean;

  // Derived state (Calculated on every change)
  subtotal: number;
  totalAmount: number;
  itemsCount: number;
  isAllSelected: boolean;
  selectedItems: TCartItem[];
}

export interface TCartStoreActions {
  // Actions
  addItem: (item: Omit<TCartItem, "quantity">, quantity: number) => void;
  removeItem: (skuId: string) => void;
  updateQuantity: (skuId: string, quantity: number) => void;
  setItems: (items: TCartItem[]) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Selection Actions
  toggleSelectItem: (skuId: string) => void;
  selectItems: (skuIds: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  addOrUpdateItem: (
    item: Omit<TCartItem, "quantity">,
    quantity: number,
  ) => void;
}

export type TCartStore = TCartStoreState & TCartStoreActions;
