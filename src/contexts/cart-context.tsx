/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

type CartProduct = {
  slug: string
  name: string
  price: number
}

type CartItem = CartProduct & {
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  itemCount: number
  total: number
  addItem: (product: CartProduct, quantity?: number) => void
  updateQuantity: (slug: string, quantity: number) => void
  removeItem: (slug: string) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    if (quantity <= 0) return
    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.slug === product.slug
      )
      if (!existingItem) return [...currentItems, { ...product, quantity }]

      return currentItems.map((item) =>
        item.slug === product.slug
          ? { ...item, quantity: item.quantity + quantity }
          : item
      )
    })
  }, [])

  const updateQuantity = useCallback((slug: string, quantity: number) => {
    setItems((currentItems) =>
      quantity <= 0
        ? currentItems.filter((item) => item.slug !== slug)
        : currentItems.map((item) =>
            item.slug === slug ? { ...item, quantity } : item
          )
    )
  }, [])

  const removeItem = useCallback((slug: string) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.slug !== slug)
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((count, item) => count + item.quantity, 0),
      total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, updateQuantity, removeItem, clearCart]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart must be used within a CartProvider")
  return context
}
