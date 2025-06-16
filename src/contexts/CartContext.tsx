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
  addItemCart: (newItem: ProductsProps, amount?: number) => void;
  removeItemCart: (productId: number) => void;
  clearCart: () => void;
  total: string;
  updateItemQuantity: (productId: number, quantity: number) => void;
  clearOldCarts: () => void;
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
    try {
      // Remove as imagens do carrinho antes de salvar no localStorage para economizar espaço
      const cartWithoutImages = cart.map(item => {
        const { imagem, ...itemWithoutImage } = item;
        return itemWithoutImage;
      });
      
      localStorage.setItem(cartKey, JSON.stringify(cartWithoutImages));
      calculateTotal(cart);
    } catch (error) {
      console.warn('Erro ao salvar carrinho no localStorage:', error);
      
      // Se o localStorage estiver cheio, tenta limpar carrinhos antigos
      if (error.name === 'QuotaExceededError') {
        try {
          // Remove carrinhos de outros usuários para liberar espaço
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('cart_') && key !== cartKey) {
              keysToRemove.push(key);
            }
          }
          
          // Remove carrinhos antigos
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          // Tenta salvar novamente
          const cartWithoutImages = cart.map(item => {
            const { imagem, ...itemWithoutImage } = item;
            return itemWithoutImage;
          });
          localStorage.setItem(cartKey, JSON.stringify(cartWithoutImages));
        } catch (secondError) {
          console.error('Não foi possível salvar o carrinho:', secondError);
          // Como último recurso, limpa o carrinho atual se não conseguir salvar
          localStorage.removeItem(cartKey);
        }
      }
    }
  }, [cart, cartKey]);

  function addItemCart(newItem: ProductsProps, amount: number = 1) {
    const indexItem = cart.findIndex((item) => item.id === newItem.id);

    if (indexItem !== -1) {
      let cartList = [...cart];
      cartList[indexItem].amount += amount;
      cartList[indexItem].total = cartList[indexItem].amount * cartList[indexItem].preco;
      // Preserva a imagem se ela existir no item original
      if (newItem.imagem && !cartList[indexItem].imagem) {
        cartList[indexItem].imagem = newItem.imagem;
      }
      setCart(cartList);
      return;
    }

    let data: CartProps = {
      ...newItem,
      amount: amount,
      total: newItem.preco * amount,
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

  // Função para limpar dados antigos do localStorage
  function clearOldCarts() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('cart_') && key !== cartKey) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      console.log(`Removidos ${keysToRemove.length} carrinhos antigos do localStorage`);
    } catch (error) {
      console.warn('Erro ao limpar carrinhos antigos:', error);
    }
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

  function updateItemQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      setCart(cart.filter((item) => item.id !== productId));
      return;
    }
    setCart(
      cart.map((item) =>
        item.id === productId
          ? { ...item, amount: quantity, total: quantity * item.preco }
          : item
      )
    );
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
        updateItemQuantity,
        clearOldCarts,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
