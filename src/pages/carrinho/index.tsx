import { Header } from "@/components/header";
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft } from "react-icons/fa";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { api } from "@/services/apiCliente";
import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/utils/formatCurrency";
import { formatDate } from "@/utils/formatDate";

export default function Carrinho() {
  const [localUser, setLocalUser] = useState(null);
  const { cart, total, removeItemCart, clearCart, updateItemQuantity } = useCart();
  const [pedidoId, setPedidoId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  const handleFinalizePurchase = async (id_pedido) => {
    try {
      setLoading(true);
      const response = await api.post("/enviar-pedido", {
        id_pedido: id_pedido,
      });

      if (response.status === 200) {
        toast.success("Pedido finalizado com sucesso! E-mail enviado.", {
          duration: 2000,
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        clearCart();
      } else {
        toast.error("Erro ao finalizar a compra.", {
          duration: 1500,
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Erro ao finalizar a compra.", {
        duration: 1500,
        position: "top-right",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para obter a URL da imagem (igual à tela de produtos)
  const getImageUrl = (imagem: string | number[] | undefined | any): string | null => {
    if (!imagem) return null;
    
    try {
      // Se já é uma string base64 válida
      if (typeof imagem === 'string') {
        // Se já contém o data:image prefix, retorna como está
        if (imagem.startsWith('data:image/')) {
          return imagem;
        }
        // Se é apenas a string base64, adiciona o prefixo
        return `data:image/jpeg;base64,${imagem}`;
      }
      
      // Se é um objeto Buffer (vindo do Prisma/PostgreSQL)
      if (imagem && typeof imagem === 'object' && imagem.data && Array.isArray(imagem.data)) {
        const bytes = new Uint8Array(imagem.data);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        return `data:image/jpeg;base64,${base64}`;
      }
      
      // Se é um array de bytes
      if (Array.isArray(imagem)) {
        const bytes = new Uint8Array(imagem);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        return `data:image/jpeg;base64,${base64}`;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      return null;
    }
  };

  const handleRegisterOrder = async () => {
    try {
      const itens = cart.map((item) => ({
        id_prod: item.id,
        quantidade: item.amount,
      }));

      const response = await api.post("/cadastro-pedido", {
        cnpj_cli: localUser?.cnpj,
        cnpj_rep: "00.000.000/0000-01",
        itens,
      });

      const id_pedido = response.data;
      if (response.status === 200) {
        toast.success(
          "Pedido registrado. Aguarde alguns segundos para ser enviado para o seu E-mail.",
          {
            duration: 2000,
            position: "top-right",
            style: {
              background: "#333",
              color: "#fff",
            },
          }
        );

        handleFinalizePurchase(id_pedido);
      } else {
        toast.error("Erro ao finalizar a compra.", {
          duration: 1500,
          position: "top-right",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.errormessage || "Erro ao processar o pedido", {
        duration: 1500,
        position: "top-right",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
          <div className="min-h-screen bg-base-200">
        <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Meu Carrinho</h1>

        {cart.length === 0 ? (
          <div className="card bg-base-100 shadow-xl p-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4">
              <FaShoppingCart size={60} className="text-gray-400" />
              <h2 className="text-2xl font-semibold">Seu carrinho está vazio</h2>
              <p className="text-gray-500 mb-4">
                Adicione produtos para começar suas compras
              </p>
              <Link href="/produtos" className="btn btn-primary">
                Ver Produtos
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista de Produtos */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <Link href="/produtos" className="btn btn-ghost">
                  <FaArrowLeft className="mr-2" /> Voltar para Produtos
                </Link>
              </div>
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body p-0">
                  <div className="overflow-x-auto">
                    <table className="table w-full">
                      <thead>
                        <tr>
                          <th>Produto</th>
                          <th className="text-center">Quantidade</th>
                          <th className="text-right">Subtotal</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map((item) => (
                          <tr key={item.id} className="hover">
                            <td>
                              <div className="flex items-center gap-4">
                                <div className="avatar">
                                  <div className="mask mask-squircle w-16 h-16">
                                    {getImageUrl(item.imagem) ? (
                                      <img
                                        src={getImageUrl(item.imagem)!}
                                        alt={item.descricao}
                                        className="object-cover"
                                        onError={(e) => {
                                          e.currentTarget.src = '';
                                          e.currentTarget.style.display = 'none';
                                          const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                                          if (placeholder) placeholder.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div 
                                      className={`w-full h-full flex items-center justify-center bg-gray-100 ${getImageUrl(item.imagem) ? 'hidden' : 'flex'}`}
                                      style={{ display: getImageUrl(item.imagem) ? 'none' : 'flex' }}
                                    >
                                      <div className="text-center">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-1 text-gray-400">
                                          <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                                        </svg>
                                        <span className="text-xs text-gray-500">Sem imagem</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-bold text-base">{item.descricao}</div>
                                  <div className="text-sm opacity-70">Validade: {formatDate(item.validade)}</div>
                                  <div className="text-sm font-semibold">
                                    {formatCurrency(item.preco)} cada
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className="flex justify-center items-center gap-2">
                                <button
                                  className="btn btn-circle btn-outline btn-sm"
                                  onClick={() => updateItemQuantity(item.id, item.amount - 1)}
                                  disabled={item.amount <= 1}
                                  title="Diminuir quantidade"
                                  aria-label="Diminuir quantidade"
                                >
                                  <FaMinus size={12} />
                                </button>
                                <input
                                  type="text"
                                  className="input input-bordered input-sm w-14 text-center"
                                  value={item.amount}
                                  onChange={e => {
                                    const value = e.target.value.replace(/\D/g, "");
                                    updateItemQuantity(item.id, value === "" ? 1 : parseInt(value, 10));
                                  }}
                                  onBlur={e => {
                                    if (e.target.value === "0") {
                                      updateItemQuantity(item.id, 0);
                                      toast.success("Produto removido do carrinho com sucesso!", {
                                        duration: 1500,
                                        position: "top-right",
                                        style: {
                                          background: "#333",
                                          color: "#fff",
                                        },
                                      });
                                    }
                                  }}
                                  aria-label="Quantidade"
                                  inputMode="numeric"
                                  pattern="[0-9]*"
                                />
                                <button
                                  className="btn btn-circle btn-outline btn-sm"
                                  onClick={() => updateItemQuantity(item.id, item.amount + 1)}
                                  title="Aumentar quantidade"
                                  aria-label="Aumentar quantidade"
                                >
                                  <FaPlus size={12} />
                                </button>
                              </div>
                            </td>
                            <td className="text-right font-semibold text-lg">
                              {formatCurrency(item.preco * item.amount)}
                            </td>
                            <td>
                              <button
                                className="btn btn-circle btn-outline btn-sm text-error hover:bg-error hover:border-error hover:text-white"
                                onClick={() => {
                                  updateItemQuantity(item.id, 0);
                                  toast.success('Produto removido do carrinho com sucesso!', {
                                    duration: 1500,
                                    position: 'top-right',
                                    style: {
                                      background: '#333',
                                      color: '#fff',
                                    },
                                  });
                                }}
                                title="Remover produto do carrinho"
                                aria-label="Remover produto do carrinho"
                              >
                                <FaTrash size={14} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumo do Pedido */}
            <div className="lg:col-span-1">
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title border-b pb-3 mb-3">Resumo do Pedido</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Itens:</span>
                      <span>{cart.reduce((acc, item) => acc + item.amount, 0)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Produtos diferentes:</span>
                      <span>{cart.length}</span>
                    </div>
                  </div>
                  
                  <div className="divider my-2"></div>
                  
                  <div className="flex justify-between items-center text-xl font-bold mb-4">
                    <span>Total:</span>
                    <span className="text-primary">{total}</span>
                  </div>
                  
                  {loading ? (
                    <button
                      className="btn btn-primary btn-block"
                      disabled
                    >
                      <span className="loading loading-spinner loading-sm mr-2"></span>
                      Finalizando...
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary btn-block"
                      onClick={handleRegisterOrder}
                      disabled={cart.length === 0}
                    >
                      <FaShoppingCart className="mr-2" />
                      Finalizar Pedido
                    </button>
                  )}
                  
                  <button
                    className="btn btn-outline btn-block mt-2"
                    onClick={() => {
                      clearCart();
                      toast.success('Carrinho limpo com sucesso!', {
                        duration: 1500,
                        position: 'top-right',
                        style: {
                          background: '#333',
                          color: '#fff',
                        },
                      });
                    }}
                    disabled={cart.length === 0}
                  >
                    Limpar Carrinho
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
