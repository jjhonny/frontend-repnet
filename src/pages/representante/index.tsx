import { AuthContext } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useContext } from "react";

export default function Representante() {
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <header className="w-full h-16 bg-white flex justify-between items-center px-3 shadow-md">
        <div>Logo</div>
        <div className="flex gap-4">
          <Link className="btn btn-sm btn-neutral" href="/produtos">
            Produtos
          </Link>
          <Link
            className="btn btn-sm btn-neutral"
            href="/representante/cadastro-produto"
          >
            Cadastrar produto
          </Link>
          <button className="btn btn-sm btn-neutral" onClick={() => signOut()}>
            Deslogar
          </button>
        </div>
      </header>
      <h1 className="flex justify-center text-5xl mt-20">
        Pagina Home Representante
      </h1>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
