import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
import Link from "next/link";
import { useContext } from "react";

export default function Cliente() {
  const { signOut } = useContext(AuthContext);

  return (
    <>
      <Header />
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
