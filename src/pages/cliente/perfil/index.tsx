import { Header } from "@/components/header";
import { AuthContext } from "@/contexts/AuthContex";
import { canSSRAuth } from "@/utils/canSSRAuth";
import { useContext } from "react";

export default function PerfilCliente() {
  const { Infouser } = useContext(AuthContext);

  return (
    <>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          Perfil do {Infouser.categoria === "C" ? "Cliente" : "Representante"}
        </h1>
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Informações do Usuário</h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Razão Social
              </label>
              <input
                type="text"
                className="input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={Infouser.razao_social}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">CNPJ</label>
              <input
                type="text"
                className="input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={Infouser.cnpj}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={Infouser.email}
                readOnly
              />
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-medium text-gray-700">
                Categoria
              </label>
              <input
                type="text"
                className="input input-bordered p-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
                value={Infouser.categoria === "C" ? "Cliente" : "Representante"}
                readOnly
              />
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
