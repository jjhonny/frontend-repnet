import { Header } from "@/components/header";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContex";
import { BsBagCheckFill } from "react-icons/bs";
import { FaPen, FaShoppingCart } from "react-icons/fa";
import { MdAddCircleOutline } from "react-icons/md";

export default function Representante() {
  const { user } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-5xl font-bold">Bem-vindo!!</h1>
        <div className="mt-10 w-full max-w-4xl">
          {/* Resumo do Cliente */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Resumo do Representante</h2>
            <p>
              <span className="font-bold">Nome:</span> {user?.razao_social}
            </p>
            <p>
              <span className="font-bold">Email: </span>
              {user?.email}
            </p>
          </div>

          {/* Atalhos Rápidos */}
          <div className="bg-white shadow-2xl rounded-2xl p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Atalhos Rápidos</h2>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/representante/cadastro-produto"
                className="btn btn-primary rounded-2xl"
              >
                <MdAddCircleOutline />
                Cadastrar Produto
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
                <MdAddCircleOutline />
                Cadastrar Marca
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
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
