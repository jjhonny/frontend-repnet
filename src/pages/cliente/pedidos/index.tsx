import { Header } from "@/components/header";
import { UserProps } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { FaUser, FaDollarSign, FaClipboardList } from "react-icons/fa";

export interface PedidoItem {
  id: number;
  descricao: string;
  quantidade: number;
}

export interface PedidoInfo {
  id: number;
  status: string;
  valor_total: number;
  cliente: string;
  representante: string;
  produtos: PedidoItem[];
}

export default function PedidosFeitos() {
  const [localUser, setLocalUser] = useState<UserProps>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pedidos, setPedidos] = useState<PedidoInfo[]>([]);

  useEffect(() => {
    const storageUser = localStorage.getItem("user");
    if (storageUser) {
      setLocalUser(JSON.parse(storageUser));
    }
  }, []);

  useEffect(() => {
    async function handleSearchOrders() {
      if (!localUser.cnpj) return;
      setLoading(true);
      try {
        const response = await api.post("/pedidos", { cnpj: localUser.cnpj });
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

    if (localUser?.cnpj) {
      handleSearchOrders();
    } else {
      console.error("CNPJ do usuário está indefinido");
    }
  }, [localUser]);

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
        <div className="max-w-md hero bg-base-100 rounded-box mb-6 shadow-md mx-auto">
          <div className="hero-content text-center py-6">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
                Pedidos Feitos
              </h1>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-screen">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto px-4">
            {pedidos.length >= 1 ? (
              pedidos.map((pedido) => (
                <div
                  key={pedido.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-900">
                      <FaClipboardList className="inline-block text-blue-600 mr-2" />{" "}
                      Pedido #{pedido.id}
                    </h2>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaUser className="h-5 w-5 mr-2 text-green-500" />
                        <span className="text-sm">
                          Cliente: {pedido.cliente}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FaUser className="h-5 w-5 mr-2 text-purple-500" />
                        <span className="text-sm">
                          Representante: {pedido.representante}
                        </span>
                      </div>
                    </div>
                    <div className="pt-4 flex items-center justify-between border-t border-gray-200">
                      <div className="flex flex-col">
                        <h1 className="text-1xl font-bold">Valor Total</h1>
                        <p className="text-xl font-bold text-gray-700">
                          R${" "}
                          {Intl.NumberFormat("pt-BR", {
                            currency: "BRL",
                            minimumFractionDigits: 2,
                          }).format(Number(pedido.valor_total))}
                        </p>
                      </div>
                    </div>
                    <div className="pt-4">
                      <h3 className="font-semibold">
                        <FaClipboardList className="inline-block text-gray-700 mr-2" />
                        Produtos:
                      </h3>
                      <ul className="space-y-1 pl-6 list-disc text-gray-700">
                        {pedido.produtos.map((item) => (
                          <li key={item.id}>
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
