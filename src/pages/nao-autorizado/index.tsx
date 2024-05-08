import Link from "next/link";
import { AuthContext } from "@/contexts/AuthContex";
import { useContext } from "react";

export default function NotAuthorized() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h2 className="font-bold text-2xl">401</h2>
      <p className="text-xl my-2">Não autorizado</p>
      <Link
        className="btn btn-neutral"
        href={user.categoria === "C" ? "/cliente" : "/representante"}
      >
        Voltar para home
      </Link>
    </div>
  );
}
