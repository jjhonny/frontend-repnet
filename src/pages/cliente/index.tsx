import { Header } from "@/components/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AuthContext, UserProps } from "@/contexts/AuthContex";
import { BsBagCheckFill } from "react-icons/bs";
import { FaPen, FaShoppingCart } from "react-icons/fa";

export default function Cliente() {
  const { user } = useContext(AuthContext);
  const [localUser, setLocalUser] = useState<UserProps | null>(null); // Estado para armazenar dados do localStorage

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser)); // Converte de volta para objeto e armazena no estado
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-5xl font-bold">Bem-vindo!!</h1>
        <div className="mt-10 w-full max-w-4xl">
          {/* Resumo do Cliente */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Resumo do Cliente</h2>
            <p>
              <span className="font-bold">Nome:</span> {localUser?.razao_social}
            </p>
            <p>
              <span className="font-bold">Email: </span>
              {localUser?.email}
            </p>
          </div>

          {/* Atalhos Rápidos */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Atalhos Rápidos</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/cliente/pedidos"
                className="btn btn-primary rounded-2xl"
              >
                <BsBagCheckFill />
                Meus Pedidos
              </Link>
              <Link
                href="/cliente/perfil"
                className="btn btn-primary rounded-2xl"
              >
                <FaPen /> Editar Perfil
              </Link>
              <Link href="/carrinho" className="btn btn-primary rounded-2xl">
                <FaShoppingCart className="mr-2" />
                Carrinho de Compras
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
