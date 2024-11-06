import { Header } from "@/components/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useEffect, useState } from "react";
import { UserProps } from "@/contexts/AuthContex";
import { FaEnvelope, FaPen, FaUser } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";

export default function Representante() {
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
                Gerencie seus produtos e informações pessoais
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Client Info Card */}
          <div className="bg-base-100 shadow-md rounded-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6 flex items-center gap-2">
                <FaUser className="text-primary" />
                Informações do Representante
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

          {/* Quick Actions Card */}
          <div className="bg-base-100 shadow-xl rounded-md">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-6">Ações Rápidas</h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/representante/cadastro-produto"
                  className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                >
                  <MdAddCircleOutline /> Cadastrar Produto
                </Link>
                <Link
                  href="/representante/cadastro-categoria"
                  className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                >
                  <MdAddCircleOutline /> Cadastrar Categoria
                </Link>
                <Link
                  href="/representante/cadastro-marca"
                  className="btn btn-primary gap-2 hover:scale-105 transition-transform"
                >
                  <MdAddCircleOutline /> Cadastrar Marca
                </Link>
                <Link
                  href="/representante/perfil"
                  className="btn btn-secondary gap-2 hover:scale-105 transition-transform"
                >
                  <FaPen /> Editar perfil
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    /*  <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow flex flex-col items-center mt-20">
        <h1 className="text-5xl font-bold">Bem-vindo!!</h1>
        <div className="mt-10 w-full max-w-4xl">
          <div className="bg-white shadow-2xl rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Resumo do Representante</h2>
            <p>
              <span className="font-bold">Nome:</span> {localUser?.razao_social}
            </p>
            <p>
              <span className="font-bold">Email: </span>
              {localUser?.email}
            </p>
          </div>
          <div className="bg-white shadow-2xl rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Atalhos Rápidos</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/representante/cadastro-produto"
                className="btn btn-primary rounded-2xl"
              >
                <MdAddCircleOutline /> Cadastrar Produto
              </Link>
              <Link
                href="/representante/cadastro-categoria"
                className="btn btn-primary rounded-2xl"
              >
                <MdAddCircleOutline /> Cadastrar Categoria
              </Link>
              <Link
                href="/representante/cadastro-marca"
                className="btn btn-primary rounded-2xl"
              >
                <MdAddCircleOutline /> Cadastrar Marca
              </Link>
              <Link
                href="/representante/perfil"
                className="btn btn-primary rounded-2xl"
              >
                <FaPen /> Editar perfil
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div> */
  );
}
export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
