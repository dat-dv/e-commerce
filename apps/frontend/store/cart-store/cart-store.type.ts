export interface TCartItem {
  id: string;
  product_id: string;
  sku_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  attributes?: string;
}

export interface TCartStoreState {
  items: TCartItem[];
  selectedSkuIds: string[];
  loading: boolean;
  isOpen: boolean;
  _hasHydrated: boolean;

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
  removeItem: (sku_id: string) => void;
  updateQuantity: (sku_id: string, quantity: number) => void;
  setItems: (items: TCartItem[]) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Selection Actions
  toggleSelectItem: (sku_id: string) => void;
  selectItems: (sku_ids: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
  addOrUpdateItem: (
    item: Omit<TCartItem, "quantity">,
    quantity: number,
  ) => void;
}

export type TCartStore = TCartStoreState & TCartStoreActions;
