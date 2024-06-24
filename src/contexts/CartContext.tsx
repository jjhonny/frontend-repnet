import { createContext, ReactNode, useContext, useState } from "react";
import { ProductsProps } from "@/pages/produtos";

interface CartContextData {
  cart: CartProps[];
  cartAmount: number;
  addItemCart: (newItem: ProductsProps) => void;
  removeItemCart: (productId: number) => void;
  total: string;
}

interface CartProps extends ProductsProps {
  amount: number;
  total: number;
}

interface CartProviderProps {
  children: ReactNode;
}

export const CartContext = createContext({} as CartContextData);

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<CartProps[]>([]);
  const [total, setTotal] = useState("");

  function addItemCart(newItem: ProductsProps) {
    const indexItem = cart.findIndex((item) => item.id === newItem.id);

    if (indexItem !== -1) {
      let cartList = [...cart];

      cartList[indexItem].amount++;
      cartList[indexItem].total =
        cartList[indexItem].amount * cartList[indexItem].preco;

      setCart(cartList);
      calculateTotal(cartList);
      return;
    }

    let data: CartProps = {
      ...newItem,
      amount: 1,
      total: newItem.preco,
    };

    setCart([...cart, data]);
    calculateTotal([...cart, data]);
  }

  function removeItemCart(productId: number) {
    const updatedCart = cart
      .map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            amount: item.amount - 1,
            total: item.total - item.preco,
          };
        }
        return item;
      })
      .filter((item) => item.amount > 0);

    setCart(updatedCart);
    calculateTotal(updatedCart);
  }

  function calculateTotal(items: CartProps[]) {
    let result = items.reduce((acc, obj) => {
      return acc + obj.total;
    }, 0);
    const resultFormatted = result.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    setTotal(resultFormatted);
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        cartAmount: cart.reduce((acc, item) => acc + item.amount, 0),
        addItemCart,
        removeItemCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
