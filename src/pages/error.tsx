"use client";
import { useEffect } from "react";
import Link from "next/link";

const Error = ({ error, reset }: { error: Error; reset: () => void }) => {
  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <div className="flex flex-col min-h-screen justify-center items-center">
      <h2 className="font-bold text-2xl">Ops algo deu errado!</h2>
      <Link className="btn btn-neutral" href="/">
        Voltar para home
      </Link>
    </div>
  );
};

export default Error;
