import { Header } from "@/components/header";
import { UserProps } from "@/contexts/AuthContex";
import { api } from "@/services/apiCliente";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUser, FaClipboardList, FaTag, FaShoppingCart, FaBox, FaDollarSign, FaClock } from "react-icons/fa";

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

// Função para definir a cor do status do pedido (para uso futuro)
/* 
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pendente':
      return 'bg-yellow-100 text-yellow-800';
    case 'aprovado':
      return 'bg-green-100 text-green-800';
    case 'enviado':
      return 'bg-blue-100 text-blue-800';
    case 'entregue':
      return 'bg-purple-100 text-purple-800';
    case 'cancelado':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
*/

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

  return (
    <div className="min-h-screen flex flex-col bg-base-200">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-base-100 shadow-md rounded-xl mb-8 p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Meus Pedidos
              </h1>
              <p className="text-gray-600 mt-1">
                Acompanhe seus pedidos e histórico de compras
              </p>
            </div>
            <div className="hidden sm:block">
              <FaShoppingCart className="w-14 h-14 text-blue-500/30" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center py-20 bg-base-100 rounded-xl shadow-sm border border-gray-200">
            <span className="loading loading-spinner loading-lg text-primary"></span>
            <p className="mt-4 text-gray-600">Carregando seus pedidos...</p>
          </div>
        ) : (
          <>
            {pedidos.length >= 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {pedidos.map((pedido) => (
                  <div
                    key={pedido.id}
                    className="bg-base-100 rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="bg-primary text-white px-4 py-2 font-semibold flex items-center justify-between">
                      <h2 className="text-base flex items-center">
                        <FaClipboardList className="mr-2" />
                        Pedido #{pedido.id}
                      </h2>
                      {/* Exibição do status comentada (para uso futuro)
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(pedido.status)}`}>
                        {pedido.status}
                      </span>
                      */}
                    </div>
                    
                    <div className="p-5">
                      <div className="space-y-4">
                        <div className="flex flex-col space-y-2">
                          <div className="flex items-center text-gray-700 text-sm">
                            <FaUser className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium">Cliente:</span>
                            <span className="ml-1 truncate">{pedido.cliente}</span>
                          </div>
                          <div className="flex items-center text-gray-700 text-sm">
                            <FaUser className="w-4 h-4 mr-2 text-primary" />
                            <span className="font-medium">Representante:</span>
                            <span className="ml-1 truncate">{pedido.representante}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <h3 className="text-sm font-medium text-gray-800 flex items-center mb-2">
                            <FaBox className="w-4 h-4 mr-1 text-gray-600" />
                            Produtos
                          </h3>
                          <ul className="space-y-1 pl-6 list-disc text-sm text-gray-700">
                            {pedido.produtos.map((item) => (
                              <li key={item.id} className="truncate">
                                <span className="font-medium">{item.descricao}</span> - {item.quantidade} un.
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center text-sm text-gray-500">
                            <FaClock className="w-4 h-4 mr-1" />
                            <span>Pedido recente</span>
                          </div>
                          <div className="flex items-center text-green-700 font-bold">
                            <FaDollarSign className="w-4 h-4 mr-1" />
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL"
                            }).format(Number(pedido.valor_total))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center bg-base-100 rounded-xl shadow-sm border border-gray-200">
                <FaClipboardList className="w-16 h-16 text-gray-300 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">Nenhum pedido encontrado</h2>
                <p className="text-gray-500 max-w-md">
                  Você ainda não realizou nenhum pedido. Explore nossos produtos e faça sua primeira compra!
                </p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
