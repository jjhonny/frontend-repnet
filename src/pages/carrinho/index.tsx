import { Header } from "@/components/header";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useCart } from "@/contexts/CartContext";
import toast from "react-hot-toast";
import { api } from "@/services/apiCliente";
import { useContext, useState } from "react";
import { AuthContext } from "@/contexts/AuthContex";

export default function Carrinho() {
  const { user } = useContext(AuthContext);
  const { cart, total, removeItemCart, clearCart } = useCart();
  const [pedidoId, setPedidoId] = useState(null); // Estado para armazenar o ID do pedido

  const handleRemoveItem = (productId) => {
    removeItemCart(productId);
    toast.success(`Item removido do carrinho com sucesso!`, {
      duration: 1500,
      position: "top-center",
      style: {
        background: "#333",
        color: "#fff",
      },
    });
  };

  const handleFinalizePurchase = async (id_pedido) => {
    try {
      const response = await api.post("/enviar-pedido", {
        id_pedido: id_pedido,
      });

      if (response.status === 200) {
        toast.success("Pedido Finalizado com Sucesso! E-mail enviado.", {
          duration: 2000,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
        clearCart();
      } else {
        toast.error("Erro ao finalizar a compra.", {
          duration: 1500,
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error("Erro ao finalizar a compra.", {
        duration: 1500,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  const handleRegisterOrder = async () => {
    try {
      const itens = cart.map((item) => ({
        id_prod: item.id,
        quantidade: item.amount,
      }));

      const response = await api.post("/cadastro-pedido", {
        cnpj_cli: user.cnpj, // CNPJ do cliente (substitua pelo seu sistema de autenticação)
        cnpj_rep: "12.345.678/0001-99", // CNPJ do representante (substitua pelo seu sistema de autenticação)
        itens,
      });

      const id_pedido = response.data;
      if (response.status === 200) {
        toast.success(
          "Pedido registrado. Aguarde alguns segundos para ser enviado para o seu E-mail.",
          {
            duration: 2000,
            position: "top-center",
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
          position: "top-center",
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (error) {
      toast.error(error.response.data.errormessage, {
        duration: 1500,
        position: "top-center",
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    }
  };

  return (
    <div>
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-5">
        <h1 className="text-3xl font-bold mb-4">Meu Carrinho</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cart.length > 0 ? (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-white/90 rounded-lg shadow-lg p-4 flex items-center"
              >
                <img
                  src="https://cdn.sanity.io/images/tlr8oxjg/production/7b7f05720074a848850e0705779306c27da5a6cf-1065x597.png?w=3840&q=80&fit=clip&auto=format"
                  alt="Produto"
                  className="w-20 h-20 mr-4 object-cover rounded-lg shadow-xl"
                />
                <div>
                  <h2 className="text-lg font-semibold">{item.descricao}</h2>
                  <p className="text-gray-500">{item.validade}</p>
                  <div className="flex items-center mt-2">
                    <p className="text-gray-700 font-bold">
                      R${" "}
                      {Intl.NumberFormat("pt-BR", {
                        currency: "BRL",
                        minimumFractionDigits: 2,
                      }).format(Number(item.preco))}
                    </p>
                    <span className="ml-4">Quantidade: {item.amount}</span>
                  </div>
                </div>
                <button
                  className="text-red-600 ml-auto"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))
          ) : (
            <div className="mt-3 text-2xl">Carrinho vazio</div>
          )}
        </div>
        <div className="mt-4 text-right">
          <p className="text-lg font-semibold">Total: {total}</p>
        </div>
        <div className="mt-8 flex justify-end">
          <button
            className="btn btn-primary rounded-2xl flex items-center shadow-2xl"
            onClick={handleRegisterOrder}
          >
            <FaShoppingCart className="mr-2" />
            Finalizar Pedido ({cart.reduce(
              (acc, item) => acc + item.amount,
              0
            )}{" "}
            itens)
          </button>
        </div>
      </div>
    </div>
  );
}
