import { AuthContext } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useContext } from "react";

export default function Cliente() {
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <header className="w-full h-16 bg-white flex justify-between items-center px-3 shadow-md">
        <div>Logo</div>
        <div className="flex gap-4">
          <Link className="btn btn-sm btn-neutral" href="/produtos">
            Produtos
          </Link>
          <button className="btn btn-sm btn-neutral" onClick={() => signOut()}>
            Deslogar
          </button>
        </div>
      </header>
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-5xl">Pagina Home Cliente</h1>
      </div>
    </>
  );
}

export const getServerSideProps = canSSRAuth(async (context) => {
  return {
    props: {},
  };
});
