export interface ICartItem {
  id: string;
  product_id: string;
  sku_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
  attributes?: string;
}

export interface ICartStoreState {
  items: ICartItem[];
  selectedSkuIds: string[];
  loading: boolean;
  isOpen: boolean;
  _hasHydrated: boolean;
}

export interface ICartStoreActions {
  // Actions
  addItem: (item: Omit<ICartItem, "quantity">, quantity: number) => void;
  removeItem: (sku_id: string) => void;
  updateQuantity: (sku_id: string, quantity: number) => void;
  setItems: (items: ICartItem[]) => void;
  clearCart: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setHasHydrated: (state: boolean) => void;
  setLoading: (loading: boolean) => void;

  // Selection Actions
  toggleSelectItem: (sku_id: string) => void;
  selectItems: (sku_ids: string[]) => void;
  selectAll: () => void;
  clearSelection: () => void;
}

export type ICartStore = ICartStoreState & ICartStoreActions;
