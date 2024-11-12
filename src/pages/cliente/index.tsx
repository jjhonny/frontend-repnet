import { Header } from "@/components/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserProps } from "@/contexts/AuthContex";
import { BsBagCheckFill } from "react-icons/bs";
import { FaPen, FaShoppingCart, FaUser, FaEnvelope } from "react-icons/fa";

export default function Cliente() {
  const [localUser, setLocalUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-200">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="hero bg-base-100 rounded-box mb-8 shadow-md">
          <div className="hero-content text-center py-12">
            <div>
              <h1 className="text-5xl font-bold text-primary">Bem-vindo!</h1>
              <p className="py-4 text-base-content/70">
                Gerencie seus pedidos e informações pessoais
              </p>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-base-100 shadow-md rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                <FaUser className="text-primary" />
                Informações do Cliente
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                  <FaUser className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-base-content/70">Nome</p>
                    <p className="font-semibold">
                      {localUser?.razao_social || "Carregando..."}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-base-200 rounded-lg">
                  <FaEnvelope className="text-primary text-xl" />
                  <div>
                    <p className="text-sm text-base-content/70">Email</p>
                    <p className="font-semibold">
                      {localUser?.email || "Carregando..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-base-100 shadow-md rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Ações Rápidas</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/cliente/pedidos"
                  className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                >
                  <BsBagCheckFill className="text-xl" />
                  Meus Pedidos
                </Link>

                <Link
                  href="/cliente/perfil"
                  className="btn btn-secondary gap-2 hover:scale-105 transition-transform"
                >
                  <FaPen className="text-xl" />
                  Editar Perfil
                </Link>

                <Link
                  href="/carrinho"
                  className="btn btn-accent gap-2 hover:scale-105 transition-transform sm:col-span-2"
                >
                  <FaShoppingCart className="text-xl" />
                  Carrinho de Compras
                </Link>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 shadow-md ">
            <div className="stats shadow w-full">
              <div className="stat place-items-center">
                <div className="stat-title">Pedidos</div>
                <div className="stat-value">31</div>
                <div className="stat-desc">Desde o início</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Pedidos</div>
                <div className="stat-value text-primary">4</div>
                <div className="stat-desc">↗︎ Este mês</div>
              </div>

              <div className="stat place-items-center">
                <div className="stat-title">Total Gasto</div>
                <div className="stat-value">R$ 1,200</div>
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
