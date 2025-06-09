import { Header } from "@/components/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserProps } from "@/contexts/AuthContex";
import { FaEnvelope, FaPen, FaUser } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";
import { api } from "@/services/apiCliente";
import toast from "react-hot-toast";
import { formatCurrency } from "@/utils/formatCurrency";

interface DashboardProps {
  totalPedidos: number;
  totalPedidosMesAtual: number;
  valorTotalPedidos: number;
}

export default function Representante() {
  const [localUser, setLocalUser] = useState<UserProps | null>(null);
  const [dashboard, setDashboard] = useState<DashboardProps>({
    totalPedidos: 0,
    totalPedidosMesAtual: 0,
    valorTotalPedidos: 0,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    if (!localUser) return;

    async function handleGetDetailOrder() {
      try {
        const response = await api.post("/resumo-pedidos", {
          cnpj: localUser.cnpj,
          categoria: localUser.categoria,
        });
        const dashboardData = await response.data;
        setDashboard(dashboardData);
      } catch (error) {
        toast.error(error.response?.data?.errormessage, {
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    }
    handleGetDetailOrder();
  }, [localUser]);

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="hero bg-base-100 rounded-box mb-6 shadow-md">
          <div className="hero-content py-6 w-full">
            <div className="text-center flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
                Bem-vindo, {localUser?.razao_social || "Carregando..."}!
              </h1>
              <p className="text-base-content/70 mb-6">
                Gerencie seus produtos e informações pessoais
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm">
                <div className="flex items-center gap-2 bg-base-200 px-4 py-2 rounded-full">
                  <FaEnvelope className="text-primary" />
                  <span className="text-base-content/70">Email:</span>
                  <span className="font-medium">{localUser?.email || "Carregando..."}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6">
          <div className="bg-base-100 shadow-md rounded-lg">
            <div className="card-body py-6">
              <h2 className="card-title text-2xl mb-5">Ações Rápidas</h2>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/representante/cadastro-produto"
                  className="btn btn-primary btn-sm"
                >
                  <MdAddCircleOutline /> Cadastrar Produto
                </Link>
                <Link
                  href="/representante/cadastro-categoria"
                  className="btn btn-primary btn-sm"
                >
                  <MdAddCircleOutline /> Cadastrar Categoria
                </Link>
                <Link
                  href="/representante/cadastro-marca"
                  className="btn btn-primary btn-sm"
                >
                  <MdAddCircleOutline /> Cadastrar Marca
                </Link>
                <Link
                  href="/representante/perfil"
                  className="btn btn-secondary btn-sm"
                >
                  <FaPen /> Editar perfil
                </Link>
              </div>
            </div>
          </div>
          <div className="shadow-md overflow-x-auto">
            <div className="stats shadow w-full flex flex-col sm:flex-row">
              <div className="stat place-items-center">
                <div className="stat-title">Pedidos</div>
                <div className="stat-value">{dashboard.totalPedidos}</div>
                <div className="stat-desc">Desde o início</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Pedidos solicitados</div>
                <div className="stat-value text-primary">
                  {dashboard.totalPedidosMesAtual}
                </div>
                <div className="stat-desc">↗︎ Este mês</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Total Vendido</div>
                <div className="stat-value text-green-600">
                  R$ {formatCurrency(dashboard.valorTotalPedidos)}
                </div>
                <div className="stat-desc">↗︎ Desde o início</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
