import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import { ProductsProps } from "@/pages/produtos";

interface CartContextData {
  cart: CartProps[];
  cartAmount: number;
  addItemCart: (newItem: ProductsProps) => void;
  removeItemCart: (productId: number) => void;
  clearCart: () => void;
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
  return useContext(CartContext);
}

export function CartProvider({ children }: CartProviderProps) {
  const [localUser, setLocalUser] = useState(null);
  const [cart, setCart] = useState<CartProps[]>([]);
  const [total, setTotal] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  const cartKey = `cart_${localUser?.cnpj}`; // Define uma chave única para o carrinho do usuário

  useEffect(() => {
    const savedCart = localStorage.getItem(cartKey); // Tenta carregar o carrinho do localStorage

    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]); // Se não houver carrinho salvo, inicializa como vazio
    }
  }, [localUser]); // Atualiza o carrinho quando o usuário mudar

  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cart)); // Salva o carrinho no localStorage ao ser alterado
    calculateTotal(cart); // Calcula o total ao alterar o carrinho
  }, [cart, cartKey]);

  function addItemCart(newItem: ProductsProps) {
    const indexItem = cart.findIndex((item) => item.id === newItem.id);

    if (indexItem !== -1) {
      let cartList = [...cart];

      cartList[indexItem].amount++;
      cartList[indexItem].total =
        cartList[indexItem].amount * cartList[indexItem].preco;

      setCart(cartList);
      return;
    }

    let data: CartProps = {
      ...newItem,
      amount: 1,
      total: newItem.preco,
    };

    setCart([...cart, data]);
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
  }

  function clearCart() {
    setCart([]);
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
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
