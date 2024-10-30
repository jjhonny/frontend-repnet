import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

export interface PedidoItem {
  id: number;
  descricao: string;
  quantidade: number;
}

export interface PedidoInfo {
  id: number;
  status: string; // Assuming StatusPedido is a string, adjust if necessary
  valor_total: number;
  cliente: string;
  representante: string;
  produtos: PedidoItem[];
}

export default function PedidosFeitos() {
  const { user, signOut } = useContext(AuthContext);
  const [pedidos, setPedidos] = useState<PedidoInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function handleSearchOrders() {
      setLoading(true);
      try {
        const response = await api.post("/pedidos", { cnpj: user.cnpj });
        const pedidosBack: PedidoInfo[] = response.data;
        console.log(pedidosBack);
        if (pedidosBack.length >= 1) {
          setPedidos(pedidosBack);
        }
      } catch (error) {
        console.log("Erro ao buscar pedidos:", error);
      } finally {
        setLoading(false);
      }
    }

    if (user && user.cnpj) {
      handleSearchOrders();
    } else {
      console.error("CNPJ do usuário está indefinido");
    }
  }, [user]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "Sem data";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Data inválida";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <>
      <Header />
      <Toaster />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-center mb-8">Pedidos Feitos</h1>
        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="w-full flex flex-wrap justify-center max-w-7xl mx-auto px-4 mt-6 gap-6">
            {pedidos.length >= 1 ? (
              pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden w-64 hover:scale-105 transition-all pb-1"
                >
                  <div className="p-2">
                    <h2 className="text-lg font-semibold">
                      Pedido #{pedido.id}
                    </h2>
                    <p className="text-gray-500">Status: {pedido.status}</p>
                    <p className="text-gray-500">Cliente: {pedido.cliente}</p>
                    <p className="text-gray-500">
                      Representante: {pedido.representante}
                    </p>
                    <div className="mt-2">
                      <p className="text-gray-700 font-bold">
                        Valor Total: R${" "}
                        {Intl.NumberFormat("pt-BR", {
                          currency: "BRL",
                          minimumFractionDigits: 2,
                        }).format(Number(pedido.valor_total))}
                      </p>
                    </div>
                    <div className="mt-2">
                      <h3 className="font-semibold">Produtos:</h3>
                      <ul>
                        {pedido.produtos.map((item) => (
                          <li key={item.id} className="text-gray-700">
                            {item.descricao} - {item.quantidade} unidades
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-2xl">
                Sem pedidos cadastrados
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
