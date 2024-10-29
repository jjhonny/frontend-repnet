import Link from "next/link";
import { AuthContext, UserProps } from "@/contexts/AuthContex";
import { useContext, useEffect, useState } from "react";

export default function NotAuthorized() {
  const { user } = useContext(AuthContext);
  const [localUser, setLocalUser] = useState<UserProps | null>(null); // Estado para armazenar dados do localStorage

  // UseEffect para carregar o usuário do localStorage após o carregamento do componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser)); // Converte de volta para objeto e armazena no estado
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h2 className="font-bold text-2xl">401</h2>
      <p className="text-xl my-2">Não autorizado</p>
      <Link
        className="btn btn-neutral"
        href={localUser?.categoria === "C" ? "/cliente" : "/representante"}
      >
        Voltar para home
      </Link>
    </div>
  );
}
