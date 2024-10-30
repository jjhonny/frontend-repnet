import { UserProps } from "@/contexts/AuthContex";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function NotFound() {
  const [localUser, setLocalUser] = useState<UserProps | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setLocalUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h2 className="font-bold text-2xl">404</h2>
      <p className="text-xl my-2">Está página não existe</p>
      <Link
        className="btn btn-neutral"
        href={localUser?.categoria === "C" ? "/cliente" : "/representante"}
      >
        Voltar para home
      </Link>
    </div>
  );
}
